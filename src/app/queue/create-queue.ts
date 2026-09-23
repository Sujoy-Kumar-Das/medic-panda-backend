import { Queue, QueueOptions } from "bullmq"
import { bullMQConnection } from "./queue.config"

// queue util function for create multiple queues
export const createQueue =
    <T>(name: string, options?: Partial<QueueOptions>): Queue<T> => {

        return new Queue<T>(name, {
            connection: bullMQConnection,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: "exponential", delay: 2000 },
                removeOnComplete: 100,
                removeOnFail: 500,
            },
            ...options,
        })
    }
