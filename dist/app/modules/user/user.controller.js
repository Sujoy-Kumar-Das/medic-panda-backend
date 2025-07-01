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
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const setCookie_1 = require("../../utils/setCookie");
const user_service_1 = require("./user.service");
const createCustomerController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = yield user_service_1.userService.createCustomerService(req.body);
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
        message: 'Customer created successfully.',
        data: accessToken,
    });
}));
const createAdminController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.createAdminService(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Admin created successfully.',
        data: result,
    });
}));
const updateUserEmailController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield user_service_1.userService.updateUserEmail(userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Email updated successfully.',
        data: result,
    });
}));
const getMeController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    const result = yield user_service_1.userService.getMeService(userId, role);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User profile fetched successfully.',
        data: result,
    });
}));
// get all users controller
const getAllUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getAllUsers(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All user fetched successfully.',
        data: result,
    });
}));
const getSingleUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.userService.getSingleUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: ' User fetched successfully.',
        data: result,
    });
}));
const getAllBlockedUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getAllBlockedUsers();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All blocked user fetched successfully.',
        data: result,
    });
}));
const blockAUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.blockUsrService(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User blocked successfully.',
        data: result,
    });
}));
const unBlockAUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.unBlockUsrService(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User unblock successfully.',
        data: result,
    });
}));
const deleteAUserController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.deleteUsrService(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User deleted successfully.',
        data: result,
    });
}));
const verifyEmailLinkController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield user_service_1.userService.createEmailVerificationOTP(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Please check your email and verify with in 5 minutes.',
        data: result,
    });
}));
const confirmEmailVerificationController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    const otp = req.body;
    const result = yield user_service_1.userService.confirmVerification(userId, role, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Email verified successfully.',
        data: result,
    });
}));
const updateUserInfoController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    const result = yield user_service_1.userService.updateUserInfo(userId, role, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User Information updated successfully.',
        data: result,
    });
}));
exports.userController = {
    createCustomerController,
    createAdminController,
    updateUserEmailController,
    blockAUserController,
    unBlockAUserController,
    deleteAUserController,
    getMeController,
    getAllUserController,
    getSingleUserController,
    getAllBlockedUserController,
    verifyEmailLinkController,
    confirmEmailVerificationController,
    updateUserInfoController,
};
