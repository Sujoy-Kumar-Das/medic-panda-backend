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
exports.productModel = void 0;
const mongoose_1 = require("mongoose");
const updateExpiredDiscounts_1 = require("../../utils/updateExpiredDiscounts");
const discountSchema = new mongoose_1.Schema({
    discountStatus: {
        type: Boolean,
        default: false,
    },
    percentage: {
        type: Number,
        required: [true, 'Discount percentage is required.'],
    },
    discountPrice: {
        type: Number,
        required: false,
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required.'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required.'],
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required.'],
    },
    endTime: {
        type: String,
        required: [true, 'End time is required.'],
    },
}, {
    _id: false,
    versionKey: false,
});
const ratingSchema = new mongoose_1.Schema({
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
}, { _id: false, versionKey: false, timestamps: true });
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required.'],
    },
    thumbnail: {
        type: String,
        required: [true, 'Product thumbnail is required.'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required.'],
    },
    discount: {
        type: discountSchema,
        required: false,
        default: null,
    },
    stockStatus: {
        type: Boolean,
        default: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Category is required.'],
        ref: 'category',
    },
    manufacturer: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'Manufacturer is required.'],
        ref: 'manufacturer',
    },
    rating: {
        type: ratingSchema,
        default: { average: 0, count: 0, lastUpdated: new Date() },
    },
    isWishList: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
    },
});
// Post-query middleware to clean up expired discounts
productSchema.post(['find', 'findOne'], function (docs, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!docs)
                return next();
            yield (0, updateExpiredDiscounts_1.updateExpiredDiscountsForFetchedProducts)(docs);
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
productSchema.post('findOneAndUpdate', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!doc)
                return next();
            yield (0, updateExpiredDiscounts_1.updateExpiredDiscountsForFetchedProducts)(doc);
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
productSchema.post('aggregate', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!doc)
                return next();
            yield (0, updateExpiredDiscounts_1.updateExpiredDiscountsForFetchedProducts)(doc);
            next();
        }
        catch (err) {
            next(err);
        }
    });
});
productSchema.statics.isProductExistsById = function (id, session) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.productModel
            .findById(id)
            .select('+isDeleted')
            .session(session || null);
    });
};
// method for remove sensitive fields
productSchema.methods.toJSON = function () {
    const product = this.toObject();
    delete product.isDeleted;
    return product;
};
exports.productModel = (0, mongoose_1.model)('product', productSchema);
