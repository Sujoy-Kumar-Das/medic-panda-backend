import { model, Model, Schema } from "mongoose";
import { IOauth } from "./oauth.interface";

const oauthSchema = new Schema<IOauth>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: [true, "User ID is required for oauth."],
            index: true,
        },
        provider: {
            type: String,
            enum: {
                values: ["google", "facebook", "credential"],
                message: "Provider '{VALUE}' is invalid. Allowed providers are: google, facebook, credential.",
            },
            required: [true, "O auth provider must be specified."],
        },
        providerId: {
            type: String,
            required: [true, "Provider ID is required."],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const OauthModel: Model<IOauth> = model<IOauth>("Oauth", oauthSchema);

