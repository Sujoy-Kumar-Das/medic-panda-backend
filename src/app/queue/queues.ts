import { createQueue } from "./create-queue";
import { IOtpJobData } from "./queue.interface";
import { QUEUEKEY } from "./queue.key";



export const otpQueue = createQueue<IOtpJobData>(QUEUEKEY.OTP);
