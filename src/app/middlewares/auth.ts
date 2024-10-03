import config from '../config';
import AppError from '../errors/AppError';
import { IUserRoles } from '../interface/user.roles.interface';
import { userModel } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import verifyToken from '../utils/verifyJwtToken';

const auth = (...requiredRoles: IUserRoles[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new AppError(404, 'You are not authorize.');
    }

    const decoded = verifyToken(token, config.access_token as string);

    const { role, userId, iat } = decoded;

    const user = await userModel.findById(userId);

    if (!user) {
      throw new AppError(404, 'User not found.');
    }

    if (user.isBlocked) {
      throw new AppError(403, 'This user is blocked');
    }

    if (user.isDeleted) {
      throw new AppError(403, 'This user is not found.');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(403, 'You are not authorize!');
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

    req.user = { email: user.email, role: user.role, userId: user._id };

    next();
  });
};

export default auth;
