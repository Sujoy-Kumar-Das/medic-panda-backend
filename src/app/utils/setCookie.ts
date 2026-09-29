import { Response } from 'express';


interface ICookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "none" | "lax";
  path?: string;
  maxAge?: number;
}

interface SetCookieParams {
  res: Response;
  name: string;
  value: string;
  options?: ICookieOptions
}



export function setCookie({ res, name, value, options }: SetCookieParams): void {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    ...options,
  };

  res.cookie(name, value, cookieOptions);
}
