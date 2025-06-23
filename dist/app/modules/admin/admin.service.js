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
exports.adminService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const admin_model_1 = require("./admin.model");
const getAllAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.aggregate([
        {
            $match: {
                role: { $in: [user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin] },
                isDeleted: false,
                isBlocked: false,
            },
        },
        {
            $lookup: {
                from: 'admins',
                localField: '_id',
                foreignField: 'user',
                as: 'adminDetails',
            },
        },
        {
            $match: {
                adminDetails: { $ne: [] },
            },
        },
        {
            $project: {
                email: 1,
                role: 1,
                isBlocked: 1,
                isDeleted: 1,
                adminDetails: 1,
            },
        },
    ]);
    return result;
});
const getSingleAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.adminModel.findOne({ user: userId }).populate('user');
    return result;
});
const getBlockedAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    const blockedUsers = yield user_model_1.userModel.aggregate([
        {
            $match: {
                isBlocked: true,
            },
        },
        {
            $lookup: {
                from: 'admins',
                localField: '_id',
                foreignField: 'user',
                as: 'adminDetails',
            },
        },
        {
            $match: {
                adminDetails: { $ne: [] },
            },
        },
        {
            $project: {
                email: 1,
                role: 1,
                isBlocked: 1,
                customerDetails: 1,
            },
        },
    ]);
    return blockedUsers;
});
const getDeletedAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUsers = yield user_model_1.userModel.aggregate([
        {
            $match: {
                isDeleted: true,
            },
        },
        {
            $lookup: {
                from: 'admins',
                localField: '_id',
                foreignField: 'user',
                as: 'adminDetails',
            },
        },
        {
            $match: {
                adminDetails: { $ne: [] },
            },
        },
        {
            $project: {
                email: 1,
                role: 1,
                isDeleted: 1,
                customerDetails: 1,
            },
        },
    ]);
    return deletedUsers;
});
const blockAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield user_model_1.userModel.findById(userId);
    if (!admin) {
        throw new AppError_1.default(404, 'This user is not found');
    }
    if (admin.isDeleted) {
        throw new AppError_1.default(404, 'This user is deleted');
    }
    const blockStatus = !admin.isBlocked;
    const result = yield user_model_1.userModel.findByIdAndUpdate(userId, { isBlocked: blockStatus }, { new: true });
    return result;
});
const deleteAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield user_model_1.userModel.findById(userId);
    if (!admin) {
        throw new AppError_1.default(404, 'This user is not found');
    }
    const deleteStatus = !admin.isDeleted;
    const result = yield user_model_1.userModel.findByIdAndUpdate(userId, { isDeleted: deleteStatus }, { new: true });
    return result;
});
const updateAdminInfo = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = payload, remainingFields = __rest(payload, ["address"]);
    const modifiedData = Object.assign({}, remainingFields);
    if (address && Object.keys(address).length) {
        for (const [key, value] of Object.entries(address)) {
            modifiedData[`address.${key}`] = value;
        }
    }
    const result = yield admin_model_1.adminModel.findOneAndUpdate({ user: id }, modifiedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.adminService = {
    getAllAdmins,
    getSingleAdmin,
    getBlockedAdmins,
    getDeletedAdmins,
    blockAdmin,
    deleteAdmin,
    updateAdminInfo,
};
