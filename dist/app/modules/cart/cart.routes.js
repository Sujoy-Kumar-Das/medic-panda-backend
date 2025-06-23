"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const cart_controller_1 = require("./cart.controller");
const cart_validation_schema_1 = require("./cart.validation.schema");
const router = (0, express_1.Router)();
router.post('/cart', (0, validateRequest_1.default)(cart_validation_schema_1.cartValidationSchema.createCartValidationSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.user), cart_controller_1.cartController.createCartController);
router.get('/cart', (0, auth_1.default)(user_constant_1.USER_ROLE.user), cart_controller_1.cartController.getAllCartProductController);
router.get('/cart/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user), cart_controller_1.cartController.getSingleCartDetailsController);
router.get('/cart-length', (0, auth_1.default)(user_constant_1.USER_ROLE.user), cart_controller_1.cartController.getCartLengthController);
router.delete('/cart/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user), cart_controller_1.cartController.deleteCartController);
exports.cartRouter = router;
