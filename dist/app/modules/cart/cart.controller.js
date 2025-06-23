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
exports.cartController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const cart_service_1 = require("./cart.service");
const createCartController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { product } = req.body;
    const result = yield cart_service_1.cartService.createCartService({
        user: userId,
        product: product,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Product added in cart.',
        data: result,
    });
}));
const getAllCartProductController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield cart_service_1.cartService.getAllCartProductService(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Cart product fetched successfully.',
        data: result,
    });
}));
const getSingleCartDetailsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { id } = req.params;
    const result = yield cart_service_1.cartService.getSingleCartService(id, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Cart Details fetched successfully.',
        data: result,
    });
}));
const getCartLengthController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield cart_service_1.cartService.getCartLengthService(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Cart length fetched successfully.',
        data: result,
    });
}));
const deleteCartController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { id } = req.params;
    const result = yield cart_service_1.cartService.deleteCartService(id, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Product removed from your cart successfully.',
        data: result,
    });
}));
exports.cartController = {
    createCartController,
    getAllCartProductController,
    getCartLengthController,
    deleteCartController,
    getSingleCartDetailsController,
};
