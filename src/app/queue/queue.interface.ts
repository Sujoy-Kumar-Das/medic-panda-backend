export interface IOtpJobData {
    email: string;
    subject: string;
    name: string
    otp: string;
}

export interface IForgotPasswordJobData {
    email: string;
    subject: string;
    resetLink: string;
}
