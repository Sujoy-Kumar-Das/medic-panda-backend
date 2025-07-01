"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.updateExpiredDiscountsForFetchedProducts = exports.updateExpiredDiscountsBulk = void 0;
const porduct_model_1 = require("../modules/product/porduct.model");
const updateExpiredDiscountsBulk = function (model) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const currentDateStr = now.toISOString().split('T')[0];
        const currentTimeStr = now.toTimeString().substring(0, 5);
        const result = yield model.updateMany({
            discount: { $exists: true, $ne: null },
            isDeleted: { $ne: true },
            $or: [
                { 'discount.endDate': { $lt: currentDateStr } },
                {
                    'discount.endDate': currentDateStr,
                    'discount.endTime': { $lt: currentTimeStr },
                },
            ],
        }, { $set: { discount: null } });
        return result;
    });
};
exports.updateExpiredDiscountsBulk = updateExpiredDiscountsBulk;
const updateExpiredDiscountsForFetchedProducts = (products) => __awaiter(void 0, void 0, void 0, function* () {
    if (!products)
        return [];
    const normalizedProducts = Array.isArray(products) ? products : [products];
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().substring(0, 5);
    const expiredIds = normalizedProducts
        .filter((product) => {
        const discount = product.discount;
        if (!discount)
            return false;
        const discountEndDate = new Date(discount.endDate)
            .toISOString()
            .split('T')[0];
        return (discountEndDate < currentDate ||
            (discountEndDate === currentDate && discount.endTime < currentTime));
    })
        .map((p) => p._id);
    if (expiredIds.length > 0) {
        yield porduct_model_1.productModel.updateMany({ _id: { $in: expiredIds } }, { $set: { discount: null } });
        normalizedProducts.forEach((p) => {
            if (expiredIds.some((id) => id.equals(p._id))) {
                p.discount = null;
            }
        });
    }
    return normalizedProducts;
});
exports.updateExpiredDiscountsForFetchedProducts = updateExpiredDiscountsForFetchedProducts;
