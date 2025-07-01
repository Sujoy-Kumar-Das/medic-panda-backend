"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.post('/success-payment', payment_controller_1.paymentController.successPaymentController);
router.post('/success-cancel', payment_controller_1.paymentController.cancelPaymentController);
router.post('/success-payment/failed-payment', payment_controller_1.paymentController.failedPaymentController);
router.post('/pay-now/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), payment_controller_1.paymentController.payNowController);
router.get('/payment', (0, auth_1.default)(user_constant_1.USER_ROLE.user), payment_controller_1.paymentController.paymentHistoryController);
exports.paymentRouter = router;
