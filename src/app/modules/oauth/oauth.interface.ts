import { Schema } from "mongoose";

export interface IOauth {
    _id?: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    provider: "google" | "facebook" | "credential";
    providerId: string;
    createdAt?: string;
    updatedAt?: string
}
