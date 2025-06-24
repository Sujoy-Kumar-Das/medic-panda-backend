import { Response } from 'express';

interface SetCookieParams {
  res: Response;
  name: string;
  value: string;
  maxAge?: number;
}

export function setCookie({
  res,
  name,
  value,
  maxAge = 24 * 60 * 60 * 1000,
}: SetCookieParams): void {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge,
  };

  res.cookie(name, value, cookieOptions);
}
