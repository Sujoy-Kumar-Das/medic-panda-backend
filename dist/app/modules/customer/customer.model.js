"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerModel = exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.addressSchema = new mongoose_1.Schema({
    city: {
        type: String,
        required: [true, 'City is required.'],
    },
    country: {
        type: String,
        required: [true, 'Country is required.'],
    },
    postalCode: {
        type: Number,
        required: [true, 'Postal code is required.'],
    },
    street: {
        type: String,
        required: [true, 'Street is required.'],
    },
}, {
    _id: false,
    versionKey: false,
});
const customerSchema = new mongoose_1.Schema({
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
        required: [true, 'Photo is required.'],
    },
    contact: {
        type: String,
        default: null,
    },
    address: {
        type: exports.addressSchema,
    },
}, {
    versionKey: false,
});
exports.customerModel = (0, mongoose_1.model)('customer', customerSchema);
