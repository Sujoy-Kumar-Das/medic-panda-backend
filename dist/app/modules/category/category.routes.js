"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const category_controller_1 = require("./category.controller");
const category_schema_1 = require("./category.schema");
const router = (0, express_1.Router)();
router.post('/category', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(category_schema_1.categoryValidationSchema.createCategoryValidationSchema), category_controller_1.categoryController.createCategoryController);
router.get('/category', category_controller_1.categoryController.getAllCategoryController);
router.get('/category/:id', category_controller_1.categoryController.getSingleCategoryController);
router.patch('/category/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(category_schema_1.categoryValidationSchema.updateCategoryValidationSchema), category_controller_1.categoryController.updateCategoryController);
router.delete('/category/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), category_controller_1.categoryController.deleteCategoryController);
exports.categoryRoutes = router;
