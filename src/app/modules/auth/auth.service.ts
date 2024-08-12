import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/createJwtToken';
import { userModel } from '../user/user.model';
import { ILogin } from './auth.interface';

const loginService = async (payload: ILogin) => {
  const { email } = payload;

  const user = await userModel.isUserExists(email);

  if (!user) {
    throw new AppError(404, 'This user is not exists');
  }

  if (user?.isBlocked) {
    throw new AppError(403, 'This user is blocked.');
  }

  if (user?.isDeleted) {
    throw new AppError(404, 'This user is not found.');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
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

export const authService = { loginService };
