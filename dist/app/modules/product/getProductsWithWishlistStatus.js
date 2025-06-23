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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const wishList_model_1 = require("../wishList/wishList.model");
const getProductsWithWishlistStatus = (products_1, ...args_1) => __awaiter(void 0, [products_1, ...args_1], void 0, function* (products, userId = undefined) {
    if (!userId) {
        return products;
    }
    const wishlistItems = yield wishList_model_1.wishListModel
        .find({ user: userId })
        .select('product');
    const wishlistProductIds = wishlistItems.map((item) => item.product.toString());
    const result = products.map((product) => (Object.assign(Object.assign({}, product), { isWishList: wishlistProductIds.includes(product._id.toString()) })));
    return result;
});
exports.default = getProductsWithWishlistStatus;
