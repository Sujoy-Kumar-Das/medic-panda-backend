"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manufacturerModel = void 0;
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    country: {
        type: String,
        required: [true, 'Country is required.'],
    },
    city: {
        type: String,
        required: [true, 'City is required.'],
    },
    state: {
        type: String,
        required: [true, 'State is required.'],
    },
    zipCode: {
        type: Number,
        required: [true, 'Zip code is required.'],
    },
});
const manufacturerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Manufacturer name is required.'],
    },
    description: {
        type: String,
        required: [true, 'Manufacturer description is required.'],
    },
    contact: {
        type: String,
        required: [true, 'manufacturer Contact number is required.'],
    },
    address: {
        type: addressSchema,
        required: [true, 'Address is required.'],
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.manufacturerModel = (0, mongoose_1.model)('manufacturer', manufacturerSchema);
