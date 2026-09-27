import { Types } from "mongoose";

export interface ILogin {
  email: string;
  password: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}


export interface ILoginResponseData {
  user: {
    id: Types.ObjectId;
    email: string;
    isVerified: boolean;
  }

  access_token: string;
}
