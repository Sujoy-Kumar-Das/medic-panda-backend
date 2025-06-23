"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("./user.constant");
const user_controller_1 = require("./user.controller");
const user_schema_1 = require("./user.schema");
const router = express_1.default.Router();
// get me route
router.get('/user/get-me', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.user), user_controller_1.userController.getMeController);
// get all users
router.get('/user', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.userController.getAllUserController);
router.get('/user/:id', user_controller_1.userController.getSingleUserController);
router.post('/user/customer', (0, validateRequest_1.default)(user_schema_1.userValidationSchema.createUserValidationSchema), user_controller_1.userController.createCustomerController);
router.post('/user/admin', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(user_schema_1.userValidationSchema.createAdminValidationSchema), user_controller_1.userController.createAdminController);
router.patch('/user/email', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(user_schema_1.userValidationSchema.updateUserEmailValidationSchema), user_controller_1.userController.updateUserEmailController);
router.patch('/user/verify-email', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.userController.verifyEmailLinkController);
router.patch('/user/confirm-verification-email', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.userController.confirmEmailVerificationController);
router.patch('/user/block-user', (0, validateRequest_1.default)(user_schema_1.userValidationSchema.blockUserSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.userController.blockAUserController);
router.patch('/user/unblock-user', (0, validateRequest_1.default)(user_schema_1.userValidationSchema.blockUserSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.userController.unBlockAUserController);
router.delete('/user', (0, validateRequest_1.default)(user_schema_1.userValidationSchema.deleteUserSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), user_controller_1.userController.deleteAUserController);
router.patch('/user', (0, validateRequest_1.default)(user_schema_1.userValidationSchema.updateUserValidationSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.user), user_controller_1.userController.updateUserInfoController);
exports.userRoutes = router;
