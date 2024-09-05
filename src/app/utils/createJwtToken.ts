import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

interface IJwtPayload {
  userId: Types.ObjectId;
  role: string;
}
export const createToken = (
  payload: IJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};
