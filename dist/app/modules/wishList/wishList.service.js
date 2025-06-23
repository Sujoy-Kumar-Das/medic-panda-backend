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
exports.wishListService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const porduct_model_1 = require("../product/porduct.model");
const user_constant_1 = require("../user/user.constant");
const wishList_model_1 = require("./wishList.model");
const createWishListService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: userId, product: productId } = payload;
    //   check is the product is available
    const product = yield porduct_model_1.productModel.findById(productId);
    if (!product) {
        throw new AppError_1.default(403, `This product is not found.`);
    }
    //   is product deleted
    const isProductDeleted = product.isDeleted;
    if (isProductDeleted) {
        throw new AppError_1.default(403, `This product is deleted.`);
    }
    const isAlreadyExistInWishList = yield wishList_model_1.wishListModel.findOne({
        user: userId,
        product,
    });
    if (isAlreadyExistInWishList) {
        throw new AppError_1.default(403, 'This Product you already added in wishlist.');
    }
    const result = yield wishList_model_1.wishListModel.create(payload);
    return result;
});
const getAllWishListProductService = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === user_constant_1.USER_ROLE.user) {
        result = yield wishList_model_1.wishListModel.find({ user: id }).populate('product');
    }
    if (role === user_constant_1.USER_ROLE.admin || role === user_constant_1.USER_ROLE.superAdmin) {
        result = yield wishList_model_1.wishListModel.find();
    }
    return result;
});
const getSingleWishListProductService = (userId, productId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === user_constant_1.USER_ROLE.user) {
        result = yield wishList_model_1.wishListModel.findOne({ user: userId, product: productId });
    }
    if (role === user_constant_1.USER_ROLE.admin || role === user_constant_1.USER_ROLE.superAdmin) {
        result = yield wishList_model_1.wishListModel.findOne({ product: productId });
    }
    return result;
});
const removeFromWishListService = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield wishList_model_1.wishListModel.findOne({
        user: userId,
        product: productId,
    });
    if (!product) {
        throw new AppError_1.default(404, 'This product is already deleted.');
    }
    const covetedUserId = new mongoose_1.default.Types.ObjectId(userId);
    if (!product.user.equals(covetedUserId)) {
        throw new AppError_1.default(403, 'You not authorized for this operation!.');
    }
    return yield wishList_model_1.wishListModel.findByIdAndDelete(product._id);
});
exports.wishListService = {
    createWishListService,
    getAllWishListProductService,
    getSingleWishListProductService,
    removeFromWishListService,
};
