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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const mongoose_1 = require("mongoose");
const updateExpiredDiscounts_1 = __importDefault(require("../../utils/updateExpiredDiscounts"));
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
    id: false,
    versionKey: false,
});
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
        type: Number,
        default: 0,
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
// Pre-query middleware to clean up expired discounts
productSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, updateExpiredDiscounts_1.default)(this.model);
        this.find({ isDeleted: { $ne: true } });
        next();
    });
});
productSchema.pre('aggregate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, updateExpiredDiscounts_1.default)(this.model());
        this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
        next();
    });
});
// product statics methods
productSchema.statics.isProductExistsByName = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.productModel
            .findOne({
            name: {
                $regex: name,
                $options: 'i',
            },
        })
            .select('+isDeleted');
    });
};
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
