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
exports.reviewController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_service_1 = require("./review.service");
const createReviewController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewService.createReviewService(req.body);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: 200,
        message: 'Review added successfully.',
    });
}));
const getAllReviewController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewService.getAllReviewServiceByProduct({
        productId: req.params.productId,
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: 200,
        message: 'Review fetched successfully.',
    });
}));
const getReviewDetailsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewService.getReviewDetailsService({
        reviewId: req.params.reviewId,
    });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: 200,
        message: 'Review Details fetched successfully.',
    });
}));
const editReviewController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { reviewId } = req.params;
    const result = yield review_service_1.reviewService.editReviewService(userId, reviewId, req.body);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: 200,
        message: 'Review Updated successfully.',
    });
}));
const deleteReviewController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { productId } = req.params;
    const result = yield review_service_1.reviewService.deleteReviewService(productId, userId);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: 200,
        message: 'Review deleted successfully.',
    });
}));
exports.reviewController = {
    createReviewController,
    getAllReviewController,
    getReviewDetailsController,
    editReviewController,
    deleteReviewController,
};
