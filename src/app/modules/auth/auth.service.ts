import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import resetPasswordEmailTemplate from '../../emailTemplate/resetPasswordEmailTemplate';
import AppError from '../../errors/AppError';
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
import { customerModel } from '../customer/customer.model';
import { USER_ROLE } from '../user/user.constant';
import { userModel } from '../user/user.model';
import { IChangePassword, ILogin } from './auth.interface';

const loginService = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await userModel
    .findOne({ email })
    .select('+isBlocked +isDeleted +password');

  if (!user) {
    throw new AppError(404, 'This user is not exists');
  }

  if (user?.isBlocked) {
    throw new AppError(403, 'This user is blocked.');
  }

  if (user?.isDeleted) {
    throw new AppError(404, 'This user is not found.');
  }

  //   check is the password matched
  const isPasswordMatched = await userModel.isPasswordMatched(
    password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(403, 'Wrong password.');
  }

  const jwtPayload = {
    role: user.role,
    userId: user._id,
  };

  const accessToken = createAccessToken({ payload: jwtPayload });

  const refreshToken = createRefreshToken({ payload: jwtPayload });

  return {
    accessToken,
    refreshToken,
  };
};

const changePasswordService = async (
  userData: JwtPayload,
  payload: IChangePassword,
) => {
  const { oldPassword, newPassword } = payload;
  const { email, role, userId } = userData;

  const user = await userModel
    .findOne({ _id: userId, email, role })
    .select('+password');

  if (!user) {
    throw new AppError(404, 'This user is not exists');
  }

  //   check is the password matched
  const isPasswordMatched = await userModel.isPasswordMatched(
    oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(403, 'Old password is wrong.');
  }

  const isOldAndNewPasswordAreSame = await userModel.isPasswordMatched(
    newPassword,
    user.password,
  );

  if (isOldAndNewPasswordAreSame) {
    throw new AppError(401, 'New password must be different.');
  }

  const newHashedPassword = await hashPassword(newPassword);

  await userModel.findOneAndUpdate(
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
  const user = await userModel.findOne({ email }).select('+resetTime');
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
  await userModel.findByIdAndUpdate(
    user._id,
    { resetTime: new Date() },
    { new: true },
  );

  const jwtPayload = { role: user.role, userId: user._id };

  // Generate reset token (valid for 2 minutes)
  const forgotPasswordVerificationToken = createToken({
    payload: jwtPayload,
    secret: config.access_token as string,
    expiresIn: '20m',
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

  const user = await userModel
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

  return await userModel.findOneAndUpdate(
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

const refreshTokenService = async (token: string) => {
  const decodedToken = verifyToken(token, config.refresh_token as string);

  const { userId, iat } = decodedToken;

  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError(404, 'This user is not exists');
  }

  if (user?.isBlocked) {
    throw new AppError(403, 'This user is blocked.');
  }

  if (user?.isDeleted) {
    throw new AppError(404, 'This user is not found.');
  }

  if (
    user.passwordChangeAt &&
    userModel.isJwtIssuedBeforePasswordChange(
      user.passwordChangeAt,
      iat as number,
    )
  ) {
    throw new AppError(404, 'You are not authorized.');
  }

  const jwtPayload = {
    role: user.role,
    userId: user._id,
  };

  const accessToken = createToken({
    payload: jwtPayload,
    secret: config.access_token as string,
    expiresIn: config.accessTokenValidation as string,
  });

  return { accessToken };
};

export const authService = {
  loginService,
  changePasswordService,
  forgotPassword,
  resetPassword,
  refreshTokenService,
};
