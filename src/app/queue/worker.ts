import otpEmailHTMLTemplate from "../emailTemplate/otp-email-template";
import { sendEmail } from "../utils/sendEmail";
import { createWorker } from "./create-worker";
import { IOtpJobData } from "./queue.interface";
import { QUEUEKEY } from "./queue.key";

export const otpWorker = createWorker<IOtpJobData>(QUEUEKEY.OTP, 5, async (job) => {

    const { name, email, otp, subject } = job.data;

    // prepare OTP email template
    const template = otpEmailHTMLTemplate({ name, otpCode: otp, expiryMinutes: 5 });

    // sent the mail
    await sendEmail(email, subject, template);
});


