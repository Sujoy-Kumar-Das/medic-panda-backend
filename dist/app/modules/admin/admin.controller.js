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
exports.adminController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
const getAllAdminController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.adminService.getAllAdmins();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Admin fetched successfully.',
        data: result,
    });
}));
const getSingleAdminController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.adminService.getSingleAdmin(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Admin fetched successfully.',
        data: result,
    });
}));
const getBlockedAdminController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.adminService.getBlockedAdmins();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Blocked admin fetched successfully.',
        data: result,
    });
}));
const getDeletedAdminController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.adminService.getDeletedAdmins();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Deleted admin fetched successfully.',
        data: result,
    });
}));
const blockAdminController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.adminService.blockAdmin(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Admin blocked successfully.',
        data: result,
    });
}));
const deleteAdminController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield admin_service_1.adminService.deleteAdmin(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Admin deleted successfully.',
        data: result,
    });
}));
const updateAdminInfo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield admin_service_1.adminService.updateAdminInfo(userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Admin information updated successfully.',
        data: result,
    });
}));
exports.adminController = {
    getAllAdminController,
    getSingleAdminController,
    getBlockedAdminController,
    getDeletedAdminController,
    blockAdminController,
    deleteAdminController,
    updateAdminInfo,
};
