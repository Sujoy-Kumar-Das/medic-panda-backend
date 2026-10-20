

declare global {
  namespace Express {
    interface Request {
      auth: {
        user: {
          userId: string;
          role: string;
          email: string;
        };
      }
    }
  }
}


export { };
