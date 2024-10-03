/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';

const verifyToken = (token: string, secret: string) => {
  try {
    if (!token) {
      throw new AppError(401, 'unauthorize access');
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new AppError(401, 'unauthorize access');
  }
};

export default verifyToken;
