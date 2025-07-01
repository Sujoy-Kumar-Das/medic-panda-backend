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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const mongoose_1 = __importDefault(require("mongoose"));
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const verifyUserEmailTemplate_1 = __importDefault(require("../../emailTemplate/verifyUserEmailTemplate"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createJwtToken_1 = require("../../utils/createJwtToken");
const generateOTP_1 = __importDefault(require("../../utils/generateOTP"));
const sendEmail_1 = require("../../utils/sendEmail");
const admin_model_1 = require("../admin/admin.model");
const customer_model_1 = require("../customer/customer.model");
const user_model_1 = require("../user/user.model");
const user_constant_1 = require("./user.constant");
// create customer
const createCustomerService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, photo, contact } = payload;
    // check is the user already exists
    const isUserExists = yield user_model_1.userModel.isUserExists(email);
    if (isUserExists) {
        throw new AppError_1.default(403, `${name} already have an account.`);
    }
    // create a session
    const session = yield mongoose_1.default.startSession();
    try {
        // start transaction
        session.startTransaction();
        const userData = {
            email,
            password,
            role: user_constant_1.USER_ROLE.user,
        };
        // create the user
        const createUser = yield user_model_1.userModel.create([userData], { session });
        if (!createUser.length) {
            throw new AppError_1.default(400, 'Flailed to create customer.');
        }
        const customerData = {
            user: createUser[0]._id,
            name,
            photo,
            contact: contact ? contact : null,
        };
        const createCustomer = yield customer_model_1.customerModel.create([customerData], {
            session,
        });
        if (!createCustomer.length) {
            throw new AppError_1.default(400, 'Failed to create customer.');
        }
        yield session.commitTransaction();
        yield session.endSession();
        const jwtPayload = {
            role: createUser[0].role,
            userId: createUser[0]._id,
        };
        const accessToken = (0, createJwtToken_1.createAccessToken)({ payload: jwtPayload });
        const refreshToken = (0, createJwtToken_1.createRefreshToken)({ payload: jwtPayload });
        return { accessToken, refreshToken };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(400, 'Something went wrong for create user. Please try again.');
    }
});
// create admin
const createAdminService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    // check is the user already exists
    const user = yield user_model_1.userModel.isUserExists(email);
    if (!user) {
        throw new AppError_1.default(403, `This user is not exists.`);
    }
    if (user.role === 'admin' || user.role === 'superAdmin') {
        throw new AppError_1.default(403, `This user is already a ${user.role}`);
    }
    if (!user.isVerified) {
        throw new AppError_1.default(403, 'This user is not verified.');
    }
    if (user.isBlocked) {
        throw new AppError_1.default(403, 'This user is blocked.');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(403, 'This user is deleted.');
    }
    // create a session
    const session = yield mongoose_1.default.startSession();
    try {
        // start transaction
        session.startTransaction();
        // update the user role as a admin
        const updateRole = yield user_model_1.userModel.findOneAndUpdate({ email }, { role: user_constant_1.USER_ROLE.admin }, { new: true, session });
        if ((updateRole === null || updateRole === void 0 ? void 0 : updateRole.role) !== user_constant_1.USER_ROLE.admin) {
            throw new AppError_1.default(400, 'Flailed to create admin.');
        }
        // find the user data form customer model
        const userData = yield customer_model_1.customerModel.findOne({ user: user._id });
        if (!userData) {
            throw new AppError_1.default(404, 'Invalid user account.');
        }
        // create the admin data
        const adminData = {
            user: user._id,
            name: userData === null || userData === void 0 ? void 0 : userData.name,
            photo: userData === null || userData === void 0 ? void 0 : userData.photo,
            contact: (userData === null || userData === void 0 ? void 0 : userData.contact) ? userData === null || userData === void 0 ? void 0 : userData.contact : null,
        };
        // create admin in admin model
        const createAdmin = yield admin_model_1.adminModel.create([adminData], {
            session,
        });
        if (!createAdmin.length) {
            throw new AppError_1.default(400, 'Failed to create admin.');
        }
        // delete the user from customer model after update to admin role
        yield customer_model_1.customerModel.findByIdAndDelete(userData._id);
        // commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        return createAdmin[0];
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(400, 'Something went wrong for create admin. Please try again.');
    }
});
const updateUserEmail = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    const isUserExistsByEmail = yield user_model_1.userModel.findOne({ email });
    if (isUserExistsByEmail) {
        throw new AppError_1.default(401, 'This email already exists.');
    }
    const result = yield user_model_1.userModel.findByIdAndUpdate(userId, { email, isVerified: false }, { new: true });
    return result;
});
// get me
const getMeService = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findOne({ _id: id, role });
    if (!user) {
        throw new AppError_1.default(404, 'This user not found.');
    }
    let result;
    if (user.role === user_constant_1.USER_ROLE.user) {
        result = yield customer_model_1.customerModel.findOne({ user: user._id }).populate('user');
    }
    if (user.role === user_constant_1.USER_ROLE.admin) {
        result = yield admin_model_1.adminModel.findOne({ user: user._id }).populate('user');
    }
    if (user.role === user_constant_1.USER_ROLE.superAdmin) {
        result = yield admin_model_1.adminModel.findOne({ user: user._id }).populate('user');
    }
    return result;
});
// get all users
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new queryBuilder_1.default(user_model_1.userModel.find({ isDeleted: false }), query);
    const users = userQuery.search(['email']).filter().paginate().sort();
    const meta = yield users.countTotal();
    const result = yield users.modelQuery.select('_id email isVerified role isBlocked');
    return { meta, data: result };
});
// get single users
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findUserWithID(id);
    if (!user) {
        throw new AppError_1.default(404, 'This user is not found.');
    }
    const role = user.role;
    if (role === user_constant_1.USER_ROLE.user) {
        return yield customer_model_1.customerModel.findOne({ user: id }).populate('user');
    }
    if (role === user_constant_1.USER_ROLE.admin || role === user_constant_1.USER_ROLE.superAdmin) {
        return yield admin_model_1.adminModel.findOne({ user: id }).populate('user');
    }
});
// get all block users
const getAllBlockedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_model_1.customerModel
        .find({ isBlocked: { $eq: true } })
        .populate('user');
    const admin = yield admin_model_1.adminModel
        .find({ isBlocked: { $eq: true } })
        .populate('user');
    return [...customer, ...admin];
});
// block user
const blockUsrService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = payload;
    // Check if the user exists
    const user = yield user_model_1.userModel.findUserWithID(id);
    if (!user) {
        throw new AppError_1.default(404, 'This account is not found.');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(404, 'This account has been deleted.');
    }
    if (user.isBlocked) {
        throw new AppError_1.default(400, 'This account is already blocked.');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Block the user
        const updatedUser = yield user_model_1.userModel
            .findByIdAndUpdate(id, { isBlocked: true }, { session, new: true })
            .select('+isBlocked');
        if (!(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isBlocked)) {
            throw new AppError_1.default(400, 'Failed to block the user.');
        }
        yield session.commitTransaction();
        return updatedUser;
    }
    catch (error) {
        yield session.abortTransaction();
        console.error(error);
        throw new AppError_1.default(400, 'Something went wrong while blocking the user. Please try again.');
    }
    finally {
        session.endSession();
    }
});
// unblock user
const unBlockUsrService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = payload;
    // Check if the user exists
    const user = yield user_model_1.userModel.findUserWithID(id);
    if (!user) {
        throw new AppError_1.default(404, 'This account is not found.');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(404, 'This account has been deleted.');
    }
    if (!user.isBlocked) {
        throw new AppError_1.default(400, 'This account is already unblocked.');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Unblock the user
        const updatedUser = yield user_model_1.userModel
            .findByIdAndUpdate(id, { isBlocked: false }, { session, new: true })
            .select('+isBlocked');
        if (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isBlocked) {
            throw new AppError_1.default(400, 'Failed to unblock the user.');
        }
        yield session.commitTransaction();
        return updatedUser;
    }
    catch (error) {
        yield session.abortTransaction();
        console.error(error);
        throw new AppError_1.default(400, 'Something went wrong while unblocking the user. Please try again.');
    }
    finally {
        session.endSession();
    }
});
// delete user
const deleteUsrService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = payload;
    // Check if the user exists
    const user = yield user_model_1.userModel.findUserWithID(id);
    if (!user) {
        throw new AppError_1.default(404, 'This account is not found.');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(404, 'This account has already been deleted.');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // user as deleted
        const updatedUser = yield user_model_1.userModel
            .findByIdAndUpdate(id, { isDeleted: true }, { session, new: true })
            .select('+isDeleted');
        if (!(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isDeleted)) {
            throw new AppError_1.default(400, 'Failed to delete the user.');
        }
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        throw new AppError_1.default(400, 'Something went wrong while deleting the user. Please try again.');
    }
    finally {
        yield session.endSession();
    }
});
// createVerifyEmailLink
const createEmailVerificationOTP = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findUserWithID(id);
    if (!user) {
        throw new AppError_1.default(404, 'User not found.');
    }
    if (user.isVerified) {
        throw new AppError_1.default(201, 'Already verified.');
    }
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    if (user.otpTime && user.otpTime > twoMinutesAgo) {
        throw new AppError_1.default(401, 'Please wait 2 minutes before requesting again.');
    }
    const userInfo = user.role === user_constant_1.USER_ROLE.user
        ? yield customer_model_1.customerModel.findOne({ user: user._id })
        : yield admin_model_1.adminModel.findOne({ user: user._id });
    if (!userInfo) {
        throw new AppError_1.default(404, 'User information not found.');
    }
    const otpCode = (0, generateOTP_1.default)();
    const result = yield user_model_1.userModel
        .findOneAndUpdate({ _id: user._id }, { otpCode, otpTime: new Date() }, { new: true })
        .select('+otpCode +otpTime');
    if (!(result === null || result === void 0 ? void 0 : result.otpCode) || !result.otpTime) {
        throw new AppError_1.default(404, 'OTP generation failed.');
    }
    (0, sendEmail_1.sendEmail)(user.email, 'Verify your account', (0, verifyUserEmailTemplate_1.default)({
        name: userInfo.name,
        otpCode,
    }));
});
// confirmVerification
const confirmVerification = (userId, role, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = payload;
    const user = yield user_model_1.userModel.findUserWithID(userId);
    // Check if user exists
    if (!user) {
        throw new AppError_1.default(404, 'User not found.');
    }
    // Check if user is already verified
    if (user.isVerified) {
        throw new AppError_1.default(401, 'Already verified.');
    }
    const now = new Date(); // Current time
    // Check if otpTime is available and parse it
    if (!user.otpTime) {
        throw new AppError_1.default(401, 'OTP has not been sent yet.');
    }
    const otpSentTime = new Date(user.otpTime); // Parse the otpTime from the user object
    const twoMinutesAfterOtpSent = new Date(otpSentTime.getTime() + 2 * 60 * 1000);
    // Check if OTP is expired (it should be less than or equal to 2 minutes after it was sent)
    if (now > twoMinutesAfterOtpSent) {
        throw new AppError_1.default(401, 'This OTP is expired. Please try again.');
    }
    // Allow OTP attempts only if wrong attempts are within the time frame
    if (user.wrongOTPAttempt > 3 && now < twoMinutesAfterOtpSent) {
        throw new AppError_1.default(401, 'Too many attempts. Please wait 2 minutes.');
    }
    // Check if the provided OTP matches the stored OTP
    if (user.otpCode !== otp) {
        // Increment wrong OTP attempt count
        yield user_model_1.userModel.findByIdAndUpdate(userId, {
            $inc: { wrongOTPAttempt: 1 },
        });
        throw new AppError_1.default(401, 'Incorrect OTP.');
    }
    // Mark user as verified and reset the wrong attempt counter
    const result = yield user_model_1.userModel
        .findOneAndUpdate({ _id: user._id, role }, { isVerified: true, wrongOTPAttempt: 0 }, { new: true })
        .select('+isVerified');
    // Check if the update was successful
    if (!(result === null || result === void 0 ? void 0 : result.isVerified)) {
        throw new AppError_1.default(404, 'Verification failed.');
    }
    return result;
});
// update user info
const updateUserInfo = (id, role, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, email, password } = payload, remainingFields = __rest(payload, ["address", "email", "password"]);
    if (email || password) {
        throw new AppError_1.default(400, 'Bad request for update user info.');
    }
    const modifiedData = Object.assign({}, remainingFields);
    if (address && Object.keys(address).length) {
        for (const [key, value] of Object.entries(address)) {
            modifiedData[`address.${key}`] = value;
        }
    }
    const model = (role === user_constant_1.USER_ROLE.admin || role === user_constant_1.USER_ROLE.superAdmin
        ? admin_model_1.adminModel
        : customer_model_1.customerModel);
    return yield model.findOneAndUpdate({ user: id }, modifiedData, {
        new: true,
        runValidators: true,
    });
});
exports.userService = {
    createCustomerService,
    createAdminService,
    updateUserEmail,
    blockUsrService,
    unBlockUsrService,
    deleteUsrService,
    getMeService,
    getAllUsers,
    getSingleUser,
    getAllBlockedUsers,
    createEmailVerificationOTP,
    confirmVerification,
    updateUserInfo,
};
