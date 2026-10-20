import { Types } from "mongoose";

export interface IOauth {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    provider: "google" | "facebook" | "credential";
    providerId: string;
    createdAt?: string;
    updatedAt?: string
}
