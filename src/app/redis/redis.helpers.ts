import { Types } from "mongoose";
import config from "../config";

export const redisSingupKey = (email: string) => `singup:${email}`;
export const redisRefreshKey = (id: Types.ObjectId) => `${config.refresh_key as string}:${id}`;
export const redisForgotPasswordResethKey = (id: Types.ObjectId) => `forgot_password_reset:${id}`;
