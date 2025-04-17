import { Response } from 'express';
import config from '../config';

interface ISetCookieParams {
  res: Response;
  name: string;
  value: string;
  maxAge?: number;
  options?: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    path?: string;
  };
}

export function setCookie({
  res,
  name,
  value,
  maxAge = 24 * 60 * 60 * 1000,
  options = {},
}: ISetCookieParams): void {
  res.cookie(name, value, {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? config.node_env === 'production',
    sameSite: options.sameSite ?? 'strict',
    path: options.path ?? '/',
    maxAge,
  });
}
