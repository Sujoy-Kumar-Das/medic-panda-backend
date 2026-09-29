import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';
import config from '../../config';
import resetPasswordEmailTemplate from '../../emailTemplate/resetPasswordEmailTemplate';
import AppError from '../../errors/AppError';
import generateOtp from '../../helpers/OTP';
import generateHash from '../../helpers/hash';
import { IOtpJobData, QUEUEKEY } from '../../queue';
import { otpQueue } from '../../queue/queues';
import { RedisClient, redisRefreshKey, redisSingupKey } from '../../redis';
import { compareTime } from '../../utils';
import {
  createAccessToken,
  createRefreshToken,
  createToken,
} from '../../utils/createJwtToken';
import hashPassword from '../../utils/hashPassword';
import { sendEmail } from '../../utils/sendEmail';
import verifyToken from '../../utils/verifyJwtToken';
import { adminModel } from '../admin/admin.model';
import { ICustomer } from '../customer/customer.interface';
import { CUSTOMER, customerModel } from '../customer/customer.model';
import { USER_ROLE } from '../user/user.constant';
import { IUser } from '../user/user.interface';
import { USER } from '../user/user.model';
import { IChangePassword, ILogin, ILoginResponseData } from './auth.interface';


// auth service constranits
const MAX_OTP_ATTEMPTS = 5;
const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_DURATION_MS = 5 * 60 * 1000;

// redis time config
const SINGUP_OTP_EXPIRE = 300;

interface ISingupPayload {
  name: string;
  email: string;
  password: string;
}

interface IotpData {
  password: string;
  oTP: string;
  otpSentAt: number;
  attampt: number;
  name: string;
  email: string
}

interface IVerifyOtp {
  email: string;
  otp: string;
}

// singup user in redis and sent OTP via bullmq for verificaiton service
const singup = async (payload: ISingupPayload) => {

  const { email, password, name } = payload;

  // find the user from db and check;
  const user = await USER.findUserWithSensitiveFields({ email });

  if (user) {
    throw new AppError(409, `${name} already have an account. Please login.`);
  }

  // find and check is the key exists in the redis store or not
  const existsInRedis = await RedisClient.hgetall(redisSingupKey(email));


  if (existsInRedis && Object.keys(existsInRedis).length > 0) {
    // check how long the key valid
    const ttl = await RedisClient.ttl(redisSingupKey(email));

    throw new AppError(429, `Please wait ${ttl}s before requesting another OTP.`);
  }

  // prepare oTP and singup data for redis store

  const otp = generateOtp();
  const hasedPassword = await hashPassword(password);

  const singupData: IotpData = {
    ...payload,
    password: hasedPassword,
    oTP: generateHash(otp),
    otpSentAt: Date.now(),
    attampt: 0,
  };

  // store data in redis store with transaction pipline
  const redisTransaction = RedisClient.pipeline();

  redisTransaction.hset(redisSingupKey(email), singupData)
  redisTransaction.expire(redisSingupKey(email), SINGUP_OTP_EXPIRE)

  const results = await redisTransaction.exec();

  // redis hset, expire error and expire result
  const hsetErr = results?.[0]?.[0];
  const expireErr = results?.[1]?.[0];
  const expireResult = results?.[1]?.[1];

  // check is any error happend for set data or expire time
  if (hsetErr || expireErr) {
    throw new AppError(500, "Failed to store signup data. Please try again.");
  }

  // check expire result if failed then delete the key
  if (expireResult !== 1) {

    // if failed to set expire time then delete the key
    await RedisClient.del(redisSingupKey(email));
    throw new AppError(500, "Failed to set expiration. Please try again.");
  }


  // todo set bull MQ for emails

  const otpData: IOtpJobData = {
    subject: `Use code ${otp} to verify your account`,
    name,
    email,
    otp
  }

  await otpQueue.add(QUEUEKEY.OTP, otpData)

  return {
    email,
    expiresIn: `${SINGUP_OTP_EXPIRE} seconds`
  };



}

// get the user from redis and verify OTP then permanently store in DB service
const verifyOtp = async (payload: IVerifyOtp) => {
  const { email, otp } = payload;

  // find the user from redis store
  const userFromRedis = await RedisClient.hgetall(redisSingupKey(email));

  // check is the user exists or not
  if (!userFromRedis || Object.keys(userFromRedis).length === 0) {
    throw new AppError(404, "Your OTP session has expired. Please sign up again.");
  }

  // check wrong attampts
  const attempts = parseInt(userFromRedis.attempt, 10);
  if (attempts >= MAX_OTP_ATTEMPTS) {
    const ttl = await RedisClient.ttl(redisSingupKey(email));
    throw new AppError(429, `Too many incorrect attempts. Please try again after ${ttl} seconds`);
  }

  // check otp matched or not
  const hashedInputOtp = generateHash(otp);
  if (hashedInputOtp !== userFromRedis.oTP) {
    await RedisClient.hincrby(redisSingupKey(email), "attempt", 1);
    throw new AppError(400, "Invalid OTP.");
  }

  const session = await mongoose.startSession()
  try {
    session.startTransaction();

    // prepare data for create user
    const newUserData: IUser = {
      email,
      isEmailVerified: true,
      role: "user",
      password: userFromRedis.password

    }

    // create user with transaction
    const [newUser] = await USER.create([newUserData], { session });

    // prepare customer data
    const customerData: ICustomer = {
      name: userFromRedis.name,
      user: newUser._id,

    }

    // create customer
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [newCustomer] = await CUSTOMER.create([customerData], { session });

    const jwtPayload = {
      role: newUser.role,
      userId: newUser._id
    }

    // create access token
    const accessToken = createAccessToken({ payload: jwtPayload });

    // create refresh token
    const refreshToken = createRefreshToken({ payload: jwtPayload });

    // commint mongoose operation
    await session.commitTransaction();

    // remvoe user from redis
    await RedisClient.del(redisSingupKey(email));


    // store the refresh token in redis store
    await RedisClient.set(redisRefreshKey(newUser._id), generateHash(refreshToken), "EX",
      REFRESH_TOKEN_TTL_SECONDS);

    // prepare login data
    const loginData: ILoginResponseData = {
      access_token: accessToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        isVerified: newUser.isEmailVerified as boolean,
      }
    }

    return { refresh_token: refreshToken, ...loginData };

  } catch (error) {
    await session.abortTransaction();
    console.log("user otp verify error", error)
    throw new AppError(500, "Failed to create account. Please try again.");
  } finally {
    session.endSession()
  }




};

// check user exists then verify user then password then genrate auth and refresh token

const login = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await USER.findAndValidateUser({ email }, true);

  if (user.passwordChangeBlockTime && user.passwordChangeBlockTime > new Date()) {
    const remainingSeconds = Math.ceil(
      (user.passwordChangeBlockTime.getTime() - Date.now()) / 1000
    );

    throw new AppError(
      423,
      `Too many failed attempts. Please try again after ${remainingSeconds} seconds.`
    );
  }

  //  password check
  const isPasswordMatched = await USER.isPasswordMatched(password, user.password);

  if (!isPasswordMatched) {
    const updatedAttempts = (user.passwordWrongAttempt || 0) + 1;

    if (updatedAttempts >= MAX_LOGIN_ATTEMPTS) {
      // Lock the account temporarily and reset the counter for next time
      await USER.updateOne(
        { _id: user._id },
        {
          passwordWrongAttempt: 0,
          passwordChangeBlockTime: new Date(Date.now() + LOGIN_LOCK_DURATION_MS),
        }
      );
      throw new AppError(423, "Too many failed attempts. Your account has been temporarily locked.");
    }

    await USER.updateOne({ _id: user._id }, { passwordWrongAttempt: updatedAttempts });
    throw new AppError(403, "Invalid credentials. Email or password did not match.");
  }

  // login the user
  await USER.updateOne(
    { _id: user._id },
    {
      passwordWrongAttempt: 0,
      passwordChangeBlockTime: null,
      lastLoginAt: new Date(),
    }
  );

  // token payload
  const tokenPayload = { role: user.role, userId: user._id };

  // create tokens
  const accessToken = createAccessToken({ payload: tokenPayload });
  const refreshToken = createRefreshToken({ payload: tokenPayload });


  await RedisClient.set(
    redisRefreshKey(user._id),
    generateHash(refreshToken),
    "EX",
    REFRESH_TOKEN_TTL_SECONDS
  );

  const loginData: ILoginResponseData = {
    access_token: accessToken,
    user: {
      id: user._id,
      email: user.email,
      isVerified: user.isEmailVerified as boolean,
    },
  };

  return { refresh_token: refreshToken, ...loginData };
};


const logout = async ({ userId, email }: { userId: Types.ObjectId, email: string }) => {

  await RedisClient.del(redisRefreshKey(userId, email))

  return { message: 'Logout Successfully.' };
};

const changePasswordService = async (
  userData: JwtPayload,
  payload: IChangePassword,
) => {
  const { oldPassword, newPassword } = payload;
  const { email, role, userId } = userData;

  const user = await USER
    .findOne({ _id: userId, email, role })
    .select('+password');

  if (!user) {
    throw new AppError(404, 'This user is not exists');
  }

  //   check is the password matched
  const isPasswordMatched = await USER.isPasswordMatched(
    oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(403, 'Old password is wrong.');
  }

  const isOldAndNewPasswordAreSame = await USER.isPasswordMatched(
    newPassword,
    user.password,
  );

  if (isOldAndNewPasswordAreSame) {
    throw new AppError(401, 'New password must be different.');
  }

  const newHashedPassword = await hashPassword(newPassword);

  await USER.findOneAndUpdate(
    {
      email: user.email,
      role: user.role,
      _id: user._id,
    },
    {
      password: newHashedPassword,
      passwordChangeAt: new Date(),
    },
  );
  return null;
};

const forgotPassword = async (payload: { email: string }) => {
  const { email } = payload;

  // Find user by email
  const user = await USER.findOne({ email }).select('+resetTime');
  if (!user || user.isBlocked || user.isDeleted) {
    throw new AppError(
      404,
      user
        ? user.isBlocked
          ? 'This user is blocked.'
          : 'This user is deleted.'
        : 'This user is not found.',
    );
  }

  // Check if the reset request is within the 2-minute limit
  if (user.resetTime && !compareTime(user.resetTime, 2)) {
    throw new AppError(
      401,
      'You can request a password reset only once every 2 minutes.',
    );
  }

  // Update resetTime
  await USER.findByIdAndUpdate(
    user._id,
    { resetTime: new Date() },
    { new: true },
  );

  const jwtPayload = { role: user.role, userId: user._id };

  // Generate reset token (valid for 2 minutes)
  const forgotPasswordVerificationToken = createToken({
    payload: jwtPayload,
    secret: config.access_token as string,
    expiresIn: '2m',
  });

  // Retrieve user information based on role
  const userInfo =
    user.role === USER_ROLE.user
      ? await customerModel.findOne({ user: user._id })
      : await adminModel.findOne({ user: user._id });

  if (!userInfo) {
    throw new AppError(404, 'User information not found.');
  }

  // Prepare the reset link and email content
  const resetLink = `${config.forgotPasswordFrontendLink}?token=${forgotPasswordVerificationToken}`;
  const subject = 'Please reset your password.';

  // Send reset email
  sendEmail(
    user.email,
    subject,
    resetPasswordEmailTemplate({ name: userInfo.name, resetLink }),
  );
};

const resetPassword = async (
  token: string,
  payload: { password: string; confirmPassword: string },
) => {
  const decoded = verifyToken(token, config.access_token as string);

  const { role, userId } = decoded;

  const user = await USER
    .findOne({ _id: userId, role })
    .select('+isBlocked +isDeleted');

  if (!user) {
    throw new AppError(404, 'This user is not exists');
  }

  if (user?.isBlocked) {
    throw new AppError(403, 'This user is blocked.');
  }

  if (user?.isDeleted) {
    throw new AppError(404, 'This user is not found.');
  }

  const newHashedPassword = await hashPassword(payload.confirmPassword);

  return await USER.findOneAndUpdate(
    { _id: user._id, role: user.role },
    {
      password: newHashedPassword,
      passwordChangeAt: new Date(),
      passwordWrongAttempt: 0,
      resetTime: null,
    },
    {
      new: true,
    },
  );
};

const refreshToken = async (token: string) => {
  // verify refresh token
  const decoded = verifyToken(token, config.refresh_token as string);
  const { userId, iat } = decoded;

  // get the refresh redis key
  const key = redisRefreshKey(userId);

  // get the hash key from redis store
  const storedHash = await RedisClient.getdel(key);

  // check if the token is not available or not
  if (!storedHash) {
    throw new AppError(401, "Session expired. Please login again.");
  }

  // match both tokens
  if (storedHash !== generateHash(token)) {
    throw new AppError(401, "Invalid session. Please login again.");
  }

  const user = await USER.findAndValidateUser({ _id: userId });

  // check is users password changed before geting the access token
  if (
    user.passwordChangeAt &&
    USER.isJwtIssuedBeforePasswordChange(user.passwordChangeAt, iat as number)
  ) {
    throw new AppError(401, "Password changed. Please login again.");
  }

  // generate jwt payload for access and refresh token
  const jwtPayload = { userId: user._id, role: user.role };

  const accessToken = createAccessToken({ payload: jwtPayload });

  const newRefreshToken = createRefreshToken({
    payload: jwtPayload,
  });

  // store token in redis
  await RedisClient.set(
    key,
    generateHash(newRefreshToken),
    "EX",
    REFRESH_TOKEN_TTL_SECONDS
  );

  return { access_token: accessToken, refresh_token: newRefreshToken };
};

export const authService = {
  singup,
  verifyOtp,
  login,
  logout,
  changePasswordService,
  forgotPassword,
  resetPassword,
  refreshToken,
};
