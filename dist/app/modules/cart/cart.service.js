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
exports.cartService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const porduct_model_1 = require("../product/porduct.model");
const cart_model_1 = require("./cart.model");
const createCartService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: userId, product: productId } = payload;
    const product = yield porduct_model_1.productModel.findById(productId);
    if (!product || product.isDeleted) {
        throw new AppError_1.default(403, 'Product not found or deleted.');
    }
    const cart = yield cart_model_1.cartModel.findOne({
        user: userId,
        product: productId,
    });
    if (cart) {
        throw new AppError_1.default(401, 'This product already in your cart.');
    }
    const result = yield cart_model_1.cartModel.create(payload);
    if (!result._id) {
        throw new AppError_1.default(401, 'Failed to add product in your cart.');
    }
    return result;
});
const getAllCartProductService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_model_1.cartModel
        .find({ user: userId })
        .populate({ path: 'product', populate: { path: 'category' } });
    return result;
});
const getSingleCartService = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_model_1.cartModel
        .findOne({ user: userId, _id: id })
        .populate({ path: 'product', select: '_id name price discount' })
        .select('product');
    return result;
});
const getCartLengthService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_model_1.cartModel.countDocuments({ user: userId });
    return result;
});
const deleteCartService = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.cartModel.findOne({ _id: id, user: userId });
    if (!cart) {
        throw new AppError_1.default(404, 'This item is not found.');
    }
    yield cart_model_1.cartModel.findOneAndDelete({ _id: id, user: userId });
    return null;
});
exports.cartService = {
    createCartService,
    getAllCartProductService,
    getCartLengthService,
    deleteCartService,
    getSingleCartService,
};
