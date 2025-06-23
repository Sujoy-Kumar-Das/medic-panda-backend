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
exports.stopProductCron = exports.startProductCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const porduct_model_1 = require("../modules/product/porduct.model");
const updateExpiredDiscounts_1 = __importDefault(require("../utils/updateExpiredDiscounts"));
// Run every hour at minute 0 (e.g., 1:00, 2:00, etc.)
const productCronJob = node_cron_1.default.schedule('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () { return yield (0, updateExpiredDiscounts_1.default)(porduct_model_1.productModel); }));
const startProductCron = () => {
    productCronJob.start();
    console.log('Product discount cron job started');
    return productCronJob;
};
exports.startProductCron = startProductCron;
const stopProductCron = () => {
    productCronJob.stop();
    console.log('Product discount cron job stopped');
};
exports.stopProductCron = stopProductCron;
