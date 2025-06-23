"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = require("mongoose");
const order_interface_1 = require("./order.interface");
const orderShippingAddressSchema = new mongoose_1.Schema({
    city: {
        type: String,
        required: [true, 'City is required.'],
    },
    country: {
        type: String,
        required: [true, 'Country is required.'],
    },
    postalCode: {
        type: String,
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
const orderShippingInfoSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email.'],
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required.'],
        trim: true,
    },
    address: {
        type: orderShippingAddressSchema,
        required: true,
    },
}, {
    _id: false,
    versionKey: false,
});
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'Product is required.'],
    },
    paymentId: {
        type: String,
    },
    shippingInfo: {
        type: orderShippingInfoSchema,
        required: [true, 'Shipping address is required.'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required.'],
    },
    total: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: Object.values(order_interface_1.OrderStatus),
        default: order_interface_1.OrderStatus.PENDING,
    },
}, {
    timestamps: true,
});
exports.orderModel = (0, mongoose_1.model)('Order', orderSchema);
