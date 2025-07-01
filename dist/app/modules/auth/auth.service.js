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
exports.authService = void 0;
const config_1 = __importDefault(require("../../config"));
const resetPasswordEmailTemplate_1 = __importDefault(require("../../emailTemplate/resetPasswordEmailTemplate"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const utils_1 = require("../../utils");
const createJwtToken_1 = require("../../utils/createJwtToken");
const hashPassword_1 = __importDefault(require("../../utils/hashPassword"));
const sendEmail_1 = require("../../utils/sendEmail");
const verifyJwtToken_1 = __importDefault(require("../../utils/verifyJwtToken"));
const admin_model_1 = require("../admin/admin.model");
const customer_model_1 = require("../customer/customer.model");
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const loginService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield user_model_1.userModel
        .findOne({ email })
        .select('+isBlocked +isDeleted +password');
    if (!user) {
        throw new AppError_1.default(404, 'This user is not exists');
    }
    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        throw new AppError_1.default(403, 'This user is blocked.');
    }
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new AppError_1.default(404, 'This user is not found.');
    }
    //   check is the password matched
    const isPasswordMatched = yield user_model_1.userModel.isPasswordMatched(password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(403, 'Wrong password.');
    }
    const jwtPayload = {
        role: user.role,
        userId: user._id,
    };
    const accessToken = (0, createJwtToken_1.createAccessToken)({ payload: jwtPayload });
    const refreshToken = (0, createJwtToken_1.createRefreshToken)({ payload: jwtPayload });
    return {
        accessToken,
        refreshToken,
    };
});
const logoutService = () => __awaiter(void 0, void 0, void 0, function* () {
    return { message: 'Logout Successfully.' };
});
const changePasswordService = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const { email, role, userId } = userData;
    const user = yield user_model_1.userModel
        .findOne({ _id: userId, email, role })
        .select('+password');
    if (!user) {
        throw new AppError_1.default(404, 'This user is not exists');
    }
    //   check is the password matched
    const isPasswordMatched = yield user_model_1.userModel.isPasswordMatched(oldPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(403, 'Old password is wrong.');
    }
    const isOldAndNewPasswordAreSame = yield user_model_1.userModel.isPasswordMatched(newPassword, user.password);
    if (isOldAndNewPasswordAreSame) {
        throw new AppError_1.default(401, 'New password must be different.');
    }
    const newHashedPassword = yield (0, hashPassword_1.default)(newPassword);
    yield user_model_1.userModel.findOneAndUpdate({
        email: user.email,
        role: user.role,
        _id: user._id,
    }, {
        password: newHashedPassword,
        passwordChangeAt: new Date(),
    });
    return null;
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    // Find user by email
    const user = yield user_model_1.userModel.findOne({ email }).select('+resetTime');
    if (!user || user.isBlocked || user.isDeleted) {
        throw new AppError_1.default(404, user
            ? user.isBlocked
                ? 'This user is blocked.'
                : 'This user is deleted.'
            : 'This user is not found.');
    }
    // Check if the reset request is within the 2-minute limit
    if (user.resetTime && !(0, utils_1.compareTime)(user.resetTime, 2)) {
        throw new AppError_1.default(401, 'You can request a password reset only once every 2 minutes.');
    }
    // Update resetTime
    yield user_model_1.userModel.findByIdAndUpdate(user._id, { resetTime: new Date() }, { new: true });
    const jwtPayload = { role: user.role, userId: user._id };
    // Generate reset token (valid for 2 minutes)
    const forgotPasswordVerificationToken = (0, createJwtToken_1.createToken)({
        payload: jwtPayload,
        secret: config_1.default.access_token,
        expiresIn: '2m',
    });
    // Retrieve user information based on role
    const userInfo = user.role === user_constant_1.USER_ROLE.user
        ? yield customer_model_1.customerModel.findOne({ user: user._id })
        : yield admin_model_1.adminModel.findOne({ user: user._id });
    if (!userInfo) {
        throw new AppError_1.default(404, 'User information not found.');
    }
    // Prepare the reset link and email content
    const resetLink = `${config_1.default.forgotPasswordFrontendLink}?token=${forgotPasswordVerificationToken}`;
    const subject = 'Please reset your password.';
    // Send reset email
    (0, sendEmail_1.sendEmail)(user.email, subject, (0, resetPasswordEmailTemplate_1.default)({ name: userInfo.name, resetLink }));
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, verifyJwtToken_1.default)(token, config_1.default.access_token);
    const { role, userId } = decoded;
    const user = yield user_model_1.userModel
        .findOne({ _id: userId, role })
        .select('+isBlocked +isDeleted');
    if (!user) {
        throw new AppError_1.default(404, 'This user is not exists');
    }
    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        throw new AppError_1.default(403, 'This user is blocked.');
    }
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new AppError_1.default(404, 'This user is not found.');
    }
    const newHashedPassword = yield (0, hashPassword_1.default)(payload.confirmPassword);
    return yield user_model_1.userModel.findOneAndUpdate({ _id: user._id, role: user.role }, {
        password: newHashedPassword,
        passwordChangeAt: new Date(),
        passwordWrongAttempt: 0,
        resetTime: null,
    }, {
        new: true,
    });
});
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, verifyJwtToken_1.default)(token, config_1.default.refresh_token);
    const { userId, iat } = decodedToken;
    const user = yield user_model_1.userModel.findById(userId);
    if (!user) {
        throw new AppError_1.default(404, 'This user is not exists');
    }
    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        throw new AppError_1.default(403, 'This user is blocked.');
    }
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new AppError_1.default(404, 'This user is not found.');
    }
    if (user.passwordChangeAt &&
        user_model_1.userModel.isJwtIssuedBeforePasswordChange(user.passwordChangeAt, iat)) {
        throw new AppError_1.default(404, 'You are not authorized.');
    }
    const jwtPayload = {
        role: user.role,
        userId: user._id,
    };
    const accessToken = (0, createJwtToken_1.createToken)({
        payload: jwtPayload,
        secret: config_1.default.access_token,
        expiresIn: config_1.default.accessTokenValidation,
    });
    return { accessToken };
});
exports.authService = {
    loginService,
    logoutService,
    changePasswordService,
    forgotPassword,
    resetPassword,
    refreshTokenService,
};
