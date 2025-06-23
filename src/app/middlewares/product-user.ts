import config from '../config';
import { userModel } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import verifyToken from '../utils/verifyJwtToken';

const ANONYMOUS_USER = { email: '', role: '', userId: '' };

const productUser = () =>
  catchAsync(async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
      req.user = ANONYMOUS_USER;
      return next();
    }

    try {
      const decoded = verifyToken(token, config.access_token as string);
      const { userId, iat } = decoded;

      const user = await userModel.findUserWithID(userId);

      const isInvalid =
        !user ||
        user.isBlocked ||
        user.isDeleted ||
        (user.passwordChangeAt &&
          userModel.isJwtIssuedBeforePasswordChange(
            user.passwordChangeAt,
            iat as number,
          ));

      if (isInvalid) {
        req.user = ANONYMOUS_USER;
      } else {
        req.user = { email: user.email, role: user.role, userId: user._id };
      }
    } catch {
      req.user = ANONYMOUS_USER;
    }

    next();
  });

export default productUser;
