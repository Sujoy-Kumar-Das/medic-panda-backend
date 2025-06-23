import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      userID: string | null;
      isAborted: () => boolean;
    }
  }
}
