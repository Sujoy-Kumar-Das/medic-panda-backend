"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Product is required.'],
        ref: 'product',
    },
});
exports.cartModel = (0, mongoose_1.model)('cart', cartSchema);
