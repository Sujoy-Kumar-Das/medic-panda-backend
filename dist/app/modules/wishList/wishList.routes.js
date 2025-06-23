"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishListRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const wishList_controller_1 = require("./wishList.controller");
const router = (0, express_1.Router)();
router.post('/wish-list', (0, auth_1.default)(user_constant_1.USER_ROLE.user), wishList_controller_1.wishListController.createWishListController);
router.get('/wish-list', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), wishList_controller_1.wishListController.getAllWishListProductController);
router.get('/wish-list/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), wishList_controller_1.wishListController.getSingleWishListProductController);
router.delete('/wish-list/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), wishList_controller_1.wishListController.removeWishListProductController);
exports.wishListRouter = router;
