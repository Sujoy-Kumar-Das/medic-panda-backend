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
exports.reviewModel = void 0;
const mongoose_1 = require("mongoose");
const update_rating_1 = require("../../utils/update-rating");
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
// post middleware for review
reviewSchema.post(['save', 'findOneAndUpdate'], function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, update_rating_1.updateProductRating)(this.product);
    });
});
reviewSchema.post('findOneAndUpdate', function (review) {
    return __awaiter(this, void 0, void 0, function* () {
        if (review)
            yield (0, update_rating_1.updateProductRating)(review.product);
    });
});
reviewSchema.post('findOneAndDelete', function (review) {
    return __awaiter(this, void 0, void 0, function* () {
        if (review)
            yield (0, update_rating_1.updateProductRating)(review.product);
    });
});
exports.reviewModel = (0, mongoose_1.model)('review', reviewSchema);
