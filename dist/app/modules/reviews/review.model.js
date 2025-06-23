"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewModel = void 0;
const mongoose_1 = require("mongoose");
const replySchema = new mongoose_1.Schema({
    reply: {
        type: String,
        required: [true, 'Reply Required.'],
        min: 3,
        trim: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User Id is required.'],
    },
}, {
    timestamps: true,
});
const reviewSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    replies: {
        type: [replySchema],
        default: [],
    },
}, {
    timestamps: true,
});
exports.reviewModel = (0, mongoose_1.model)('review', reviewSchema);
