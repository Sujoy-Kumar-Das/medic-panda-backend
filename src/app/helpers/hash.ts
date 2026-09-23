import crypto from "crypto";

function generateHash(value: string): string {
    return crypto.createHash("sha256").update(value).digest("hex");
}

export default generateHash;
