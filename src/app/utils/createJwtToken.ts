import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import config from '../config';

interface IJwtPayload {
  userId: Types.ObjectId;
  role: string;
}

interface ICreateTokenPayload {
  payload: IJwtPayload;
  secret: string;
  expiresIn: string;
}
export const createToken = ({
  payload,
  expiresIn,
  secret,
}: ICreateTokenPayload) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const createAccessToken = ({ payload }: { payload: IJwtPayload }) => {
  return createToken({
    payload,
    expiresIn: String(config.accessTokenValidation),
    secret: String(config.access_token),
  });
};
export const createRefreshToken = ({ payload }: { payload: IJwtPayload }) => {
  return createToken({
    payload,
    expiresIn: String(config.refreshTokenValidation),
    secret: String(config.refresh_token),
  });
};
