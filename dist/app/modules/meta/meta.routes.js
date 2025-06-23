"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const meta_controller_1 = require("./meta.controller");
const router = (0, express_1.Router)();
router.get('/meta/user', (0, auth_1.default)(user_constant_1.USER_ROLE.user), meta_controller_1.metaController.userMetaController);
router.get('/meta/admin', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), meta_controller_1.metaController.adminMetaDataController);
exports.metaRouter = router;
