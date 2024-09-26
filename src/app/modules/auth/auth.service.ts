import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/createJwtToken';
import hashPassword from '../../utils/hashPassword';
import { sendEmail } from '../../utils/sendEmail';
import verifyToken from '../../utils/verifyJwtToken';
import { userModel } from '../user/user.model';
import { IChangePassword, ILogin } from './auth.interface';

const loginService = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await userModel.findOne({ email });

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

  const accessToken = createToken(
    jwtPayload,
    config.access_token as string,
    '1d',
  );

  const refreshToken = createToken(
    jwtPayload,
    config.refresh_token as string,
    '10d',
  );

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

  const user = await userModel.findOne({ _id: userId, email, role });

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

  const newHashedPassword = await hashPassword(newPassword);

  const isOldAndNewPasswordAreSame = await userModel.isPasswordMatched(
    newPassword,
    user.password,
  );

  if (isOldAndNewPasswordAreSame) {
    throw new AppError(401, 'New password must be different.');
  }

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
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError(404, 'This user is not found.');
  }

  if (user.isBlocked) {
    throw new AppError(404, 'This user is blocked.');
  }

  if (user.isDeleted) {
    throw new AppError(404, 'This user is deleted.');
  }

  const jwtPayload = {
    role: user.role,
    userId: user._id,
  };

  const forgotPasswordVerificationToken = createToken(
    jwtPayload,
    config.access_token as string,
    '2m',
  );

  const resetEmailLink = `${config.forgotPasswordFrontendLink}?token=${forgotPasswordVerificationToken}`;

  const subject = 'Please reset your password.';

  sendEmail(user.email, subject, resetEmailLink);
};

const resetPassword = async (
  token: string,
  payload: { newPassword: string },
) => {
  const decoded = verifyToken(token, config.access_token as string);

  const { role, userId } = decoded;

  const user = await userModel.findOne({ _id: userId, role });

  if (!user) {
    throw new AppError(404, 'This user is not exists');
  }

  if (user?.isBlocked) {
    throw new AppError(403, 'This user is blocked.');
  }

  if (user?.isDeleted) {
    throw new AppError(404, 'This user is not found.');
  }

  const newHashedPassword = await hashPassword(payload.newPassword);

  return await userModel.findOneAndUpdate(
    { _id: user._id, role: user.role },
    {
      password: newHashedPassword,
      passwordChangeAt: new Date(),
      passwordWrongAttempt: 0,
    },
    {
      new: true,
    },
  );
};

export const authService = {
  loginService,
  changePasswordService,
  forgotPassword,
  resetPassword,
};
