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
exports.paymentController = void 0;
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const payNowController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { id } = req.params;
    const result = yield payment_service_1.paymentService.payNowService(userId, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'Payment successful',
        statusCode: 200,
        data: result,
    });
}));
const successPaymentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_service_1.paymentService.successPaymentService(req.body);
    res.redirect(config_1.default.success_frontend_link);
}));
const cancelPaymentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.failedPaymentService(req.body.tran_id);
    res.redirect(result);
}));
const failedPaymentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.failedPaymentService(req.body.tran_id);
    res.redirect(result);
}));
const paymentHistoryController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.paymentService.paymentHistory(req.user.userId);
    (0, sendResponse_1.default)(res, {
        message: 'Payment history fetched successfully.',
        statusCode: 200,
        success: true,
        data: result,
    });
}));
exports.paymentController = {
    successPaymentController,
    failedPaymentController,
    cancelPaymentController,
    payNowController,
    paymentHistoryController,
};
