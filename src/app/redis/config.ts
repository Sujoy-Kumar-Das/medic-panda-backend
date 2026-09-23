import Redis from "ioredis";
import config from "../config";

export const RedisClient = new Redis(config.redisUrl as string, {
    retryStrategy(times) {
        const delay = Math.min(times * 200, 3000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false,
});


RedisClient.on("connect", () => {
    console.log("Redis connecting...");
});

RedisClient.on("ready", () => {
    console.log("Redis connection ready");
});

RedisClient.on("error", (err) => {
    console.error("Redis error:", err.message);
});

RedisClient.on("close", () => {
    console.warn("Redis connection closed");
});


