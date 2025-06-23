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
exports.sslInitPaymentService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const sslInitPaymentService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { total, productId, productName, country, phone, city, userEmail, userAddress, transactionId, } = payload;
    try {
        const paymentData = {
            store_id: config_1.default.ssl_store,
            store_passwd: config_1.default.ssl_password,
            total_amount: total.toString(),
            payment_method: 'sslcommerz',
            currency: 'BDT',
            tran_id: transactionId,
            success_url: config_1.default.ssl_success_url,
            fail_url: config_1.default.ssl_failed_url,
            cancel_url: config_1.default.ssl_cancel_url,
            emi_quota: '0',
            product_name: productName,
            product_category: 'topup',
            product_profile: productId,
            cus_email: userEmail,
            cus_add1: userAddress,
            cus_city: city,
            cus_country: country,
            cus_phone: phone,
            shipping_method: 'NO',
        };
        const res = yield axios_1.default.post(config_1.default.ssl_url, paymentData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const paymentURL = res.data.GatewayPageURL;
        return paymentURL;
    }
    catch (error) {
        console.error('An error occurred during the payment process:', error);
        throw new AppError_1.default(404, 'Failed to payment.');
    }
});
exports.sslInitPaymentService = sslInitPaymentService;
