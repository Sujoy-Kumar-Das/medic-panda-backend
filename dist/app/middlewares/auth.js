"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const verifyJwtToken_1 = __importDefault(require("../utils/verifyJwtToken"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new AppError_1.default(404, 'You are not authorize.');
        }
        const decoded = (0, verifyJwtToken_1.default)(token, config_1.default.access_token);
        const { role, userId, iat } = decoded;
        const user = yield user_model_1.userModel.findUserWithID(userId);
        if (!user) {
            throw new AppError_1.default(404, 'Unauthorized access. This user is not found.');
        }
        if (user.isBlocked) {
            throw new AppError_1.default(403, 'Unauthorized access.This user is blocked');
        }
        if (user.isDeleted) {
            throw new AppError_1.default(403, 'Unauthorized access. This user is not found.');
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(403, 'You are not authorize!');
        }
        if (user.passwordChangeAt &&
            user_model_1.userModel.isJwtIssuedBeforePasswordChange(user.passwordChangeAt, iat)) {
            throw new AppError_1.default(404, 'You are not authorized.');
        }
        req.user = { email: user.email, role: user.role, userId: user._id };
        next();
    }));
};
exports.default = auth;
