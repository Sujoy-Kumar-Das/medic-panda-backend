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
exports.replyController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const reviewReply_service_1 = require("./reviewReply.service");
const addReplyController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.replyService.addReplyService(req.params.reviewId, req.user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: result,
        message: 'Reply is added successfully',
    });
}));
const getAllReplyController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.replyService.getAllReplyService(req.params.reviewId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: result,
        message: 'Reply is fetched successfully',
    });
}));
const getSingleReplyController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.replyService.getSingleReplyService(req.params.replyId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: result,
        message: 'Reply is fetched successfully',
    });
}));
const editReplyController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.replyService.editReplyService(req.user.userId, req.params.reviewId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: result,
        message: 'Reply is updated successfully',
    });
}));
const deleteReplyController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reviewReply_service_1.replyService.deleteReplyService(req.user.userId, req.params.reviewId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: result,
        message: 'Reply is added successfully',
    });
}));
exports.replyController = {
    addReplyController,
    getAllReplyController,
    getSingleReplyController,
    editReplyController,
    deleteReplyController,
};
