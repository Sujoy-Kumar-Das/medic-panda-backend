"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manufacturerRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const manufacturer_controller_1 = require("./manufacturer.controller");
const manufacturer_validation_1 = require("./manufacturer.validation");
const router = (0, express_1.Router)();
router.post('/manufacturer', (0, validateRequest_1.default)(manufacturer_validation_1.manufacturerValidationSchema.createManufacturerValidationSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), manufacturer_controller_1.manufacturerController.createManufacturerController);
router.get('/manufacturer', manufacturer_controller_1.manufacturerController.getAllManufacturerController);
router.get('/manufacturer/:id', manufacturer_controller_1.manufacturerController.getSingleManufacturerController);
router.patch('/manufacturer/:id', manufacturer_controller_1.manufacturerController.updateManufacturerController);
router.delete('/manufacturer/:id', manufacturer_controller_1.manufacturerController.deleteManufacturerController);
exports.manufacturerRouter = router;
