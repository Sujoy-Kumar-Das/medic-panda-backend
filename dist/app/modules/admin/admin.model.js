"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminModel = void 0;
const mongoose_1 = require("mongoose");
const customer_model_1 = require("../customer/customer.model");
const adminSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
    },
    name: {
        type: String,
        required: [true, 'Name is required.'],
    },
    photo: {
        type: String,
        required: false,
    },
    contact: {
        type: String,
        default: null,
    },
    address: {
        type: customer_model_1.addressSchema,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    versionKey: false,
});
exports.adminModel = (0, mongoose_1.model)('admin', adminSchema);
