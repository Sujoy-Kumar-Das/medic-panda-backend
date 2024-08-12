import jwt from 'jsonwebtoken';

interface IJwtPayload {
  email: string;
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
