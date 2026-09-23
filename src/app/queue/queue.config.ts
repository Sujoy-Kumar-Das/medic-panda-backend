import Redis from "ioredis";
import config from "../config";

export const bullMQConnection = new Redis(config.redisUrl as string, { maxRetriesPerRequest: null });

bullMQConnection.on("error", (error) => {
    console.log(`BullMQ ERROR`, error)
})
