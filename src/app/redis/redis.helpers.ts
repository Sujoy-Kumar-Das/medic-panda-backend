export const redisSingupKey = (email: string) => `singup:${email}`;
export const redisRefreshKey = (email: string) => `refresh_token:${email}`;
