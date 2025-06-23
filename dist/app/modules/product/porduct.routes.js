"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const product_user_1 = __importDefault(require("../../middlewares/product-user"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const porduct_controller_1 = require("./porduct.controller");
const porduct_validation_schema_1 = require("./porduct.validation.schema");
const router = (0, express_1.Router)();
router.post('/product', 
// auth(USER_ROLE.admin, USER_ROLE.superAdmin),
(0, validateRequest_1.default)(porduct_validation_schema_1.productValidationSchema.createProductValidationSchema), porduct_controller_1.ProductController.createProductController);
router.get('/product', (0, product_user_1.default)(), porduct_controller_1.ProductController.getAllProductController);
router.get('/product/:id', porduct_controller_1.ProductController.getSingleProductController);
router.patch('/product/:id', 
// validateRequest(productValidationSchema.updateProductValidationSchema),
porduct_controller_1.ProductController.updateProductController);
router.delete('/product/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), porduct_controller_1.ProductController.deleteProductController);
exports.productRoutes = router;
