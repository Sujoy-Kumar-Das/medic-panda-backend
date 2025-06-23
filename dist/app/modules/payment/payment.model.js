"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = require("mongoose");
const PaymentInfoSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
    },
    order: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
    },
    transactionId: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.PaymentModel = (0, mongoose_1.model)('paymentInfo', PaymentInfoSchema);
