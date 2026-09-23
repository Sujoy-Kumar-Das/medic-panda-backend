import { Job, Worker } from "bullmq";
import { bullMQConnection } from "./queue.config";


export const createWorker = <T>(queueName: string, concurrency: number, callback: (job: Job<T>) => Promise<void>) => {

    const worker = new Worker<T>(queueName, callback, { concurrency, connection: bullMQConnection })

    worker.on("completed", (job) => console.log(`${queueName} job ${job.id} completed`));
    worker.on("failed", (job, err) => console.error(`${queueName} job ${job?.id} failed:`, err.message));

    return worker;

}
