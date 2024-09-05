import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/createJwtToken';
import hashPassword from '../../utils/hashPassword';
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
  const { email, role } = userData;

  const user = await userModel.findOne({ email, role });

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
    oldPassword,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(403, 'Wrong password.');
  }

  const newHashedPassword = await hashPassword(newPassword);

  await userModel.findOneAndUpdate(
    {
      email: user.email,
      role: user.role,
    },
    {
      password: newHashedPassword,
      passwordChangeAt: new Date(),
    },
  );
  return null;
};

export const authService = { loginService, changePasswordService };
