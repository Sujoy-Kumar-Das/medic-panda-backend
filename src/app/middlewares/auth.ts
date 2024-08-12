import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

const auth = () => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(404, 'You are not authorize.');
    }
  });
};
