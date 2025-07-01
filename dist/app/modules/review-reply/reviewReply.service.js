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
exports.replyService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const review_model_1 = require("../reviews/review.model");
const reviewReply_model_1 = require("./reviewReply.model");
const addReplyService = (reviewId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.reviewModel.findById(reviewId);
    if (!review) {
        throw new AppError_1.default(404, 'This review is not found.');
    }
    const replyData = {
        comment: payload.comment,
        review: review._id,
        user: new mongoose_1.Types.ObjectId(userId),
    };
    const result = yield reviewReply_model_1.replyModel.create(replyData);
    if (!result) {
        throw new AppError_1.default(401, 'Failed to add reply to this review.');
    }
    return result;
});
const getAllReplyService = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const replies = yield reviewReply_model_1.replyModel.find({ review: reviewId }).populate({
        path: 'user',
        select: '_id',
        populate: {
            path: 'customer',
            select: 'name photo',
        },
    });
    return replies.map((reply) => {
        var _a;
        return ({
            _id: reply._id,
            reviewId: reply.review,
            comment: reply.comment,
            createdAt: reply.createdAt,
            user: ((_a = reply.user) === null || _a === void 0 ? void 0 : _a.customer)
                ? {
                    _id: reply.user._id,
                    name: reply.user.customer.name,
                    photo: reply.user.customer.photo,
                }
                : null,
        });
    });
});
const getSingleReplyService = (replyId) => __awaiter(void 0, void 0, void 0, function* () {
    const reply = yield reviewReply_model_1.replyModel.findById(replyId).populate({
        path: 'user',
        select: '_id',
        populate: {
            path: 'customer',
            select: 'name photo',
        },
    });
    if (!reply) {
        throw new AppError_1.default(404, 'This Reply is not found.');
    }
    const user = reply === null || reply === void 0 ? void 0 : reply.user;
    return {
        _id: reply._id,
        reviewId: reply.review,
        reply: reply.comment,
        user: user.customer
            ? {
                _id: user._id,
                name: user.customer.name,
                photo: user.customer.photo,
            }
            : null,
    };
});
const editReplyService = (userId, replyId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const reply = yield reviewReply_model_1.replyModel.findById(replyId);
    if (!reply) {
        throw new AppError_1.default(404, 'This reply is not found.');
    }
    if (!userId.equals(reply.user)) {
        throw new AppError_1.default(403, "Access denied! You can't delete this comment.");
    }
    return yield reviewReply_model_1.replyModel.findByIdAndUpdate(replyId, payload, {
        new: true,
        runValidators: true,
    });
});
const deleteReplyService = (userId, replyId) => __awaiter(void 0, void 0, void 0, function* () {
    const reply = yield reviewReply_model_1.replyModel.findById(replyId);
    if (!reply) {
        throw new AppError_1.default(404, 'This reply is not found.');
    }
    if (!userId.equals(reply.user)) {
        throw new AppError_1.default(403, "Access denied! You can't delete this comment.");
    }
    yield reviewReply_model_1.replyModel.findByIdAndDelete(replyId);
    return null;
});
exports.replyService = {
    addReplyService,
    getAllReplyService,
    getSingleReplyService,
    editReplyService,
    deleteReplyService,
};
