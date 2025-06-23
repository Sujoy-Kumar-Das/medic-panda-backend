"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const createToken = ({ payload, expiresIn, secret, }) => {
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn,
    });
};
exports.createToken = createToken;
const createAccessToken = ({ payload }) => {
    return (0, exports.createToken)({
        payload,
        expiresIn: String(config_1.default.accessTokenValidation),
        secret: String(config_1.default.access_token),
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = ({ payload }) => {
    return (0, exports.createToken)({
        payload,
        expiresIn: String(config_1.default.refreshTokenValidation),
        secret: String(config_1.default.refresh_token),
    });
};
exports.createRefreshToken = createRefreshToken;
