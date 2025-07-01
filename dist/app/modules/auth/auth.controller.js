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
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const setCookie_1 = require("../../utils/setCookie");
const auth_service_1 = require("./auth.service");
const loginController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, accessToken } = yield auth_service_1.authService.loginService(req.body);
    // Set access token cookie
    (0, setCookie_1.setCookie)({
        res,
        name: 'accessToken',
        value: String(accessToken),
    });
    // Set refresh token cookie
    (0, setCookie_1.setCookie)({
        res,
        name: 'refreshToken',
        value: String(refreshToken),
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User logged in successfully.',
        data: accessToken,
    });
}));
const logoutController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.logoutService();
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User logout successfully.',
        data: result,
    });
}));
const changePasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.changePasswordService(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Password changed successfully.',
        data: result,
    });
}));
const forgotPasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Please check your email.',
        data: result,
    });
}));
const resetPasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const result = yield auth_service_1.authService.resetPassword(token, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Password reset successfully.',
        data: result,
    });
}));
const refreshTokenController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const { accessToken } = yield auth_service_1.authService.refreshTokenService(refreshToken);
    // Set access token cookie
    (0, setCookie_1.setCookie)({
        res,
        name: 'accessToken',
        value: String(accessToken),
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Access token retrieve successfully.',
        data: null,
    });
}));
exports.authController = {
    loginController,
    logoutController,
    changePasswordController,
    forgotPasswordController,
    resetPasswordController,
    refreshTokenController,
};
