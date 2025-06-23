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
exports.paymentService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const ssl_service_1 = require("../../ssl/ssl.service");
const order_interface_1 = require("../orders/order.interface");
const order_model_1 = require("../orders/order.model");
const productDetail_model_1 = require("../porductDetail/productDetail.model");
const porduct_model_1 = require("../product/porduct.model");
const user_model_1 = require("../user/user.model");
const payment_model_1 = require("./payment.model");
const successPaymentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.status !== 'VALID') {
        throw new AppError_1.default(403, 'Failed to process payment.');
    }
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    const order = yield order_model_1.orderModel.findOne({ paymentId: payload.tran_id });
    if (!order) {
        throw new AppError_1.default(404, 'Order not found.');
    }
    const user = yield user_model_1.userModel.findById(order.user);
    if (!user || user.isBlocked || user.isDeleted) {
        throw new AppError_1.default(404, 'User not found.');
    }
    const productDetail = yield productDetail_model_1.productDetailModel.findOne({ product: order.product }, null, { session });
    if (!productDetail) {
        throw new AppError_1.default(404, 'Product details not found.');
    }
    const newStock = Number(productDetail.stock) - Number(order.quantity);
    try {
        yield productDetail_model_1.productDetailModel.findOneAndUpdate({ product: order.product }, { stock: newStock }, { session, new: true });
        yield order_model_1.orderModel.updateOne({ paymentId: payload.tran_id }, { status: order_interface_1.OrderStatus.PAID }, { session });
        const paymentInfo = {
            user: order.user,
            transactionId: payload.tran_id,
            order: order._id,
        };
        const storePaymentInfo = yield payment_model_1.PaymentModel.create([paymentInfo], {
            session,
        });
        if (!storePaymentInfo) {
            throw new AppError_1.default(403, 'Failed to store payment information.');
        }
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        console.error('Transaction aborted due to error:', error);
        throw error;
    }
    finally {
        yield session.endSession();
    }
    return { userId: user._id, order };
});
const failedPaymentService = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.orderModel.findOne({ paymentId });
    if (!order || order.status === order_interface_1.OrderStatus.PAID) {
        throw new AppError_1.default(404, 'Something went wrong try again.');
    }
    return `${config_1.default.failed_frontend_link}?id=${order._id}`;
});
const payNowService = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    // find and check the order payment status
    const orderItem = yield order_model_1.orderModel.findById(orderId);
    if ((orderItem === null || orderItem === void 0 ? void 0 : orderItem.status) !== order_interface_1.OrderStatus.PENDING) {
        throw new AppError_1.default(208, 'You already paid for this product.');
    }
    //   check is the product is available
    const isProductExists = yield porduct_model_1.productModel.findById(orderItem === null || orderItem === void 0 ? void 0 : orderItem.product);
    if (!isProductExists) {
        throw new AppError_1.default(403, `This product is not found.`);
    }
    //   is product deleted
    const isProductDeleted = isProductExists.isDeleted;
    if (isProductDeleted) {
        throw new AppError_1.default(403, `This product is deleted.`);
    }
    //   is product status available
    const productStockStatus = isProductExists.stockStatus;
    if (!productStockStatus) {
        throw new AppError_1.default(403, `This product is stock out.`);
    }
    //   check product details
    const productDetails = yield productDetail_model_1.productDetailModel.findOne({
        product: orderItem === null || orderItem === void 0 ? void 0 : orderItem.product,
    });
    if (!productDetails) {
        throw new AppError_1.default(404, 'This product is not found.');
    }
    //   is product active
    const isActive = productDetails === null || productDetails === void 0 ? void 0 : productDetails.status;
    if (isActive === 'inactive') {
        throw new AppError_1.default(403, 'This product has been closed.');
    }
    //   is stock available
    const stockProduct = productDetails === null || productDetails === void 0 ? void 0 : productDetails.stock;
    if (!stockProduct) {
        throw new AppError_1.default(403, 'This product has been stock out.');
    }
    //   is enough stock available for order.
    if (Number(stockProduct) < Number(orderItem === null || orderItem === void 0 ? void 0 : orderItem.quantity)) {
        throw new AppError_1.default(403, `Not enough stock. We have only ${stockProduct} products yet.`);
    }
    const paymentId = orderItem === null || orderItem === void 0 ? void 0 : orderItem.paymentId;
    const { address: { city, country, postalCode, street }, contact, email, } = orderItem === null || orderItem === void 0 ? void 0 : orderItem.shippingInfo;
    const paymentData = {
        total: orderItem === null || orderItem === void 0 ? void 0 : orderItem.total,
        productId: orderItem === null || orderItem === void 0 ? void 0 : orderItem.product,
        productName: isProductExists.name,
        country: country,
        phone: contact,
        city: city,
        userEmail: email,
        userAddress: `${street}-${postalCode}-${street}-${city}-${country}`,
        transactionId: paymentId,
    };
    const paymentUrl = yield (0, ssl_service_1.sslInitPaymentService)(paymentData);
    if (!paymentUrl) {
        throw new AppError_1.default(403, 'Something went wrong while payment.');
    }
    return {
        paymentUrl,
    };
});
const paymentHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.PaymentModel.find({ user: userId }).populate({
        path: 'order',
        populate: {
            path: 'product',
        },
    });
    return result;
});
exports.paymentService = {
    successPaymentService,
    payNowService,
    paymentHistory,
    failedPaymentService,
};
