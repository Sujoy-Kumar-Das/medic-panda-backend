"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.orderService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const _AggregationQueryBuilder_1 = require("../../builder/ AggregationQueryBuilder");
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const ssl_service_1 = require("../../ssl/ssl.service");
const generateTransactionId_1 = __importDefault(require("../../utils/generateTransactionId"));
const cart_model_1 = require("../cart/cart.model");
const customer_model_1 = require("../customer/customer.model");
const payment_model_1 = require("../payment/payment.model");
const productDetail_model_1 = require("../porductDetail/productDetail.model");
const porduct_model_1 = require("../product/porduct.model");
const allowedOrderStatusTransitions_1 = require("./allowedOrderStatusTransitions");
const order_interface_1 = require("./order.interface");
const order_model_1 = require("./order.model");
const createOrderService = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    const { product, quantity, shippingInfo } = payload;
    try {
        session.startTransaction(); //start session
        //   check is the product is available
        const isProductExists = yield porduct_model_1.productModel.isProductExistsById(String(product), session);
        const isValidProduct = !isProductExists || isProductExists.isDeleted;
        if (isValidProduct) {
            throw new AppError_1.default(403, `This product is not found.`);
        }
        //   is product status available
        const productStockStatus = isProductExists.stockStatus;
        if (!productStockStatus) {
            throw new AppError_1.default(403, `This product is stock out.`);
        }
        //   check product details
        const productDetails = yield productDetail_model_1.productDetailModel
            .findOne({
            product,
        })
            .session(session);
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
        // is enough stock available for order.
        if (Number(stockProduct) < Number(quantity)) {
            throw new AppError_1.default(403, `Not enough stock. We have only ${stockProduct} products yet.`);
        }
        payload.user = new mongoose_1.Types.ObjectId(userId);
        payload.total =
            Number(quantity) *
                (((_a = isProductExists.discount) === null || _a === void 0 ? void 0 : _a.discountStatus)
                    ? Number(isProductExists.discount.discountPrice)
                    : Number(isProductExists.price));
        payload.paymentId = (0, generateTransactionId_1.default)();
        // destructuring payload.shippingAddress
        const { address: { city, country, street, postalCode }, contact, email, } = shippingInfo;
        const paymentData = {
            total: payload.total,
            productId: product,
            productName: isProductExists.name,
            country: country,
            phone: contact,
            city: city,
            userEmail: email,
            userAddress: `${street}-${postalCode}-${street}-${city}-${country}`,
            transactionId: payload.paymentId,
        };
        const paymentUrl = yield (0, ssl_service_1.sslInitPaymentService)(paymentData);
        if (!paymentUrl) {
            throw new AppError_1.default(403, 'Something went wrong while payment.');
        }
        // save to db
        const result = yield order_model_1.orderModel.create([payload], { session });
        if (!result[0]._id) {
            throw new AppError_1.default(403, 'Failed to place order.Try again later.');
        }
        const cartRes = yield cart_model_1.cartModel
            .findOneAndDelete({
            product,
            user: new mongoose_1.Types.ObjectId(userId),
        })
            .session(session);
        if (!(cartRes === null || cartRes === void 0 ? void 0 : cartRes._id)) {
            throw new AppError_1.default(403, 'Failed to place order.Try again later.');
        }
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl,
        };
    }
    catch (_b) {
        yield session.abortTransaction(); // Rollback transaction on error
        session.endSession();
        throw new AppError_1.default(403, 'Failed To place order');
    }
});
// get all order service by admin and supper admin
const getAllOrderServiceByAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Build the query with filters
    const ordersQuery = new queryBuilder_1.default(order_model_1.orderModel.find(), query)
        .filter()
        .sort()
        .paginate();
    // Execute the query
    const orders = yield ordersQuery.modelQuery;
    return orders;
});
// get all order by user
const getAllOrderService = (id, query) => __awaiter(void 0, void 0, void 0, function* () {
    // Build the query with filters
    const builder = new _AggregationQueryBuilder_1.AggregationQueryBuilder(order_model_1.orderModel, query)
        .match({ user: new mongoose_1.Types.ObjectId(id) })
        .lookup('products', 'product', '_id', 'product')
        .unwind('product')
        .search('product.name')
        .filter()
        .sort()
        .paginate();
    const result = yield builder.exec();
    const meta = yield builder.countTotal();
    return {
        result,
        meta,
    };
});
// get all order by user
const getSingleOrderService = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [order, userInfo] = yield Promise.all([
        order_model_1.orderModel.findOne({ _id: id, user: userId }).populate('product'),
        customer_model_1.customerModel.findOne({ user: userId }).populate('user'),
    ]);
    if (!order)
        throw new AppError_1.default(404, 'Order not found');
    const paymentInfo = yield payment_model_1.PaymentModel.findOne({
        transactionId: order.paymentId,
    });
    return { order, userInfo, paymentInfo };
});
// get all order by user
const getSingleOrderServiceByAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.orderModel.findOne({ _id: id }).populate('product');
    const paymentInfo = yield payment_model_1.PaymentModel.findOne({
        transactionId: order === null || order === void 0 ? void 0 : order.paymentId,
    });
    const userInfo = yield customer_model_1.customerModel
        .findOne({ user: order === null || order === void 0 ? void 0 : order.user })
        .populate('user');
    const result = { order, userInfo, paymentInfo };
    return result;
});
// cancel order by user, admin and supper admin
const cancelOrderService = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.orderModel.findById(orderId);
    if (!order) {
        throw new AppError_1.default(404, 'This order is not found.');
    }
    if (order.status === order_interface_1.OrderStatus.CANCELED) {
        throw new AppError_1.default(403, 'This order already canceled. ');
    }
    if (order.status === order_interface_1.OrderStatus.SHIPPED) {
        throw new AppError_1.default(404, "This order already shifted, you can't cancel it.");
    }
    if (order.status === order_interface_1.OrderStatus.DELIVERED) {
        throw new AppError_1.default(404, "This order already delivered, you can't cancel it.");
    }
    if (order.status === order_interface_1.OrderStatus.RETURNED) {
        throw new AppError_1.default(404, "This order already , you can't cancel it.");
    }
    const result = yield order_model_1.orderModel.findByIdAndUpdate(orderId, { status: order_interface_1.OrderStatus.CANCELED }, { new: true });
    return result;
});
const changeOrderStatusService = (orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = payload;
    const order = yield order_model_1.orderModel.findById(orderId);
    if (!order) {
        throw new AppError_1.default(404, 'This order is not found.');
    }
    const currentStatus = order.status;
    const allowedOrderStatus = allowedOrderStatusTransitions_1.allowedOrderStatusTransitions[currentStatus];
    if (!allowedOrderStatus.includes(status)) {
        throw new AppError_1.default(400, `You can not change ${currentStatus} to ${status}`);
    }
    const result = yield order_model_1.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if ((result === null || result === void 0 ? void 0 : result.status) !== status) {
        throw new AppError_1.default(400, 'Failed to update the status.');
    }
    return result;
});
// delete order by user, admin and supper admin
const deleteOrderService = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.orderModel.findById(orderId);
    if (!order) {
        throw new AppError_1.default(404, 'This order is not found.');
    }
    const result = yield order_model_1.orderModel.findByIdAndDelete(orderId);
    return result;
});
exports.orderService = {
    createOrderService,
    getAllOrderServiceByAdmin,
    cancelOrderService,
    getAllOrderService,
    getSingleOrderService,
    deleteOrderService,
    changeOrderStatusService,
    getSingleOrderServiceByAdmin,
};
