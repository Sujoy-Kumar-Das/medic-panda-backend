"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateDiscount = (price, discountPercentage) => {
    if (!discountPercentage) {
        return 0;
    }
    const numberPrice = Number(price);
    const numberDiscountPercentage = Number(discountPercentage);
    return Number((numberPrice - numberPrice * (numberDiscountPercentage / 100)).toFixed(2));
};
exports.default = calculateDiscount;
