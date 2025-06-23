"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productDetailModel = void 0;
const mongoose_1 = require("mongoose");
const productDetailSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'product',
    },
    images: {
        type: [String],
    },
    description: {
        type: String,
        required: [true, 'Product description is required.'],
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required.'],
        min: [0, 'Stock quantity cannot be negative.'],
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
});
exports.productDetailModel = (0, mongoose_1.model)('productDetail', productDetailSchema);
