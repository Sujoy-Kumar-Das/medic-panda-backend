import { Types } from "mongoose";
import config from "../config";

export const redisSingupKey = (email: string) => `singup:${email}`;
export const redisRefreshKey = (id: Types.ObjectId, email: string) => `${config.refresh_key as string}:${id}:${email}`;
