"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const verifyToken = (token, secret) => {
    try {
        if (!token) {
            throw new AppError_1.default(401, 'unauthorize access');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (_a) {
        throw new AppError_1.default(500, 'Invalid token.Please try again.');
    }
};
exports.default = verifyToken;
