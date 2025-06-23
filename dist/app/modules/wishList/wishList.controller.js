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
exports.wishListController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const wishList_service_1 = require("./wishList.service");
const createWishListController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield wishList_service_1.wishListService.createWishListService({
        user: userId,
        product: req.body.product,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Product added in wish list.',
        data: result,
    });
}));
const getAllWishListProductController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    const result = yield wishList_service_1.wishListService.getAllWishListProductService(userId, role);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Wish list product fetched successfully.',
        data: result,
    });
}));
const getSingleWishListProductController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = req.user;
    const { id } = req.params;
    const result = yield wishList_service_1.wishListService.getSingleWishListProductService(userId, id, role);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Wish list product fetched successfully.',
        data: result,
    });
}));
const removeWishListProductController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { id } = req.params;
    const result = yield wishList_service_1.wishListService.removeFromWishListService(userId, id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Wish list product removed successfully.',
        data: result,
    });
}));
exports.wishListController = {
    createWishListController,
    getAllWishListProductController,
    getSingleWishListProductController,
    removeWishListProductController,
};
