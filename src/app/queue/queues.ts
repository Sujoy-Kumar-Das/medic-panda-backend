import { createQueue } from "./create-queue";
import { IForgotPasswordJobData, IOtpJobData } from "./queue.interface";
import { QUEUEKEY } from "./queue.key";



export const otpQueue = createQueue<IOtpJobData>(QUEUEKEY.OTP);
export const forgotPasswordEmailQueue = createQueue<IForgotPasswordJobData>(QUEUEKEY.FORGOT_PASSWORD);
