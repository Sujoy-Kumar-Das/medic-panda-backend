"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const reviewReply_controller_1 = require("./reviewReply.controller");
const reviewReply_validateSchema_1 = require("./reviewReply.validateSchema");
const router = (0, express_1.Router)();
router.post('/review/reply/:reviewId', (0, validateRequest_1.default)(reviewReply_validateSchema_1.replyValidationSchema.addReply), (0, auth_1.default)(user_constant_1.USER_ROLE.user), reviewReply_controller_1.replyController.addReplyController);
router.get('/review/reply/:reviewId', reviewReply_controller_1.replyController.getAllReplyController);
router.get('/review/reply/details/:replyId', reviewReply_controller_1.replyController.getSingleReplyController);
router.patch('/review/reply/:reviewId', (0, auth_1.default)(user_constant_1.USER_ROLE.user), reviewReply_controller_1.replyController.editReplyController);
router.delete('/review/reply/:reviewId', (0, auth_1.default)(user_constant_1.USER_ROLE.user), reviewReply_controller_1.replyController.deleteReplyController);
exports.replyRouter = router;
