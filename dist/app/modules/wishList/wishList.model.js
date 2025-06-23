"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishListModel = void 0;
const mongoose_1 = require("mongoose");
const wishListSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User is required.'],
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Product is required.'],
        ref: 'product',
    },
}, {
    timestamps: true,
});
exports.wishListModel = (0, mongoose_1.model)('wishList', wishListSchema);
