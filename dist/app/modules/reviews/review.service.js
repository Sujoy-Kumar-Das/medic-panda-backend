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
exports.reviewService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const porduct_model_1 = require("../product/porduct.model");
const reviewReply_model_1 = require("../review-reply/reviewReply.model");
const review_model_1 = require("./review.model");
const createReviewService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield porduct_model_1.productModel.findOne({
        _id: payload.product,
        isDeleted: false,
    });
    if (!product) {
        throw new AppError_1.default(404, 'This product is not found.');
    }
    const result = yield review_model_1.reviewModel.create(payload);
    return result;
});
const getReviewDetailsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ reviewId }) {
    const review = yield review_model_1.reviewModel.findById(reviewId).populate({
        path: 'user',
        select: '_id',
        populate: {
            path: 'customer',
            select: 'name photo',
        },
    });
    if (!review) {
        throw new AppError_1.default(404, 'This review is not found.');
    }
    const user = review === null || review === void 0 ? void 0 : review.user;
    const customer = user === null || user === void 0 ? void 0 : user.customer;
    const result = {
        _id: review._id,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        user: user && customer
            ? {
                _id: user._id,
                name: customer.name,
                photo: customer.photo,
            }
            : null,
    };
    return result;
});
const getAllReviewServiceByProduct = (_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, }) {
    const reviews = yield review_model_1.reviewModel
        .find({ product: productId })
        .populate({
        path: 'user',
        select: '_id',
        populate: {
            path: 'customer',
            select: 'name photo',
        },
    })
        .populate({
        path: 'replies.user',
        select: '_id',
        populate: {
            path: 'customer',
            select: 'name photo',
        },
    })
        .sort('-createdAt');
    const result = reviews.map((review) => {
        const user = review.user;
        const customer = user === null || user === void 0 ? void 0 : user.customer;
        const replies = review.replies;
        const modifiedReplies = replies.map((reply) => ({
            reply: reply.reply,
            _id: reply._id,
            user: {
                name: reply.user.customer.name,
                photo: reply.user.customer.photo,
                _id: reply.user._id,
            },
        }));
        return {
            _id: review._id,
            comment: review.comment,
            rating: review.rating,
            replies: modifiedReplies,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            user: user && customer
                ? {
                    _id: user._id,
                    name: customer.name,
                    photo: customer.photo,
                }
                : null,
        };
    });
    return result;
});
const editReviewService = (userId, reviewId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.reviewModel.findById(reviewId);
    if (!review) {
        throw new AppError_1.default(404, 'This review is not found.');
    }
    if (!userId.equals(review.user)) {
        throw new AppError_1.default(403, "Access denied! You can't delete this comment.");
    }
    return yield review_model_1.reviewModel.findByIdAndUpdate(reviewId, payload, { new: true });
});
const deleteReviewService = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.reviewModel.findById(id);
    if (!review) {
        throw new AppError_1.default(404, 'This review is not found.');
    }
    if (!userId.equals(review.user)) {
        throw new AppError_1.default(403, "Access denied! You can't delete this comment.");
    }
    yield reviewReply_model_1.replyModel.deleteMany({ review: review._id });
    yield review_model_1.reviewModel.findByIdAndDelete(id);
    return null;
});
exports.reviewService = {
    createReviewService,
    getAllReviewServiceByProduct,
    getReviewDetailsService,
    editReviewService,
    deleteReviewService,
};
