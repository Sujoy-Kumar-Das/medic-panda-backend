"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productDetailModel = void 0;
const mongoose_1 = require("mongoose");
const productDetailSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'Product reference is required.'],
        unique: true,
    },
    images: {
        type: [String],
        required: false,
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description is required.'],
        minlength: [200, 'Short description must be at least 10 characters.'],
        maxlength: [600, 'Short description cannot exceed 200 characters.'],
        trim: true,
    },
    detailedDescription: {
        type: String,
        required: [true, 'Detailed description is required.'],
        minlength: [500, 'Detailed description must be at least 20 characters.'],
        trim: true,
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required.'],
        min: [0, 'Stock quantity cannot be negative.'],
    },
}, {
    timestamps: true,
});
exports.productDetailModel = (0, mongoose_1.model)('ProductDetail', productDetailSchema);
