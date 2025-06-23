"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isDiscountExpired = (discount) => {
    if (!discount)
        return false;
    const now = new Date();
    const endDate = new Date(discount.endDate);
    const [endHours, endMinutes] = discount.endTime.split(':').map(Number);
    endDate.setHours(endHours, endMinutes, 0, 0);
    return now > endDate;
};
exports.default = isDiscountExpired;
