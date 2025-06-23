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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const admin_model_1 = require("../modules/admin/admin.model");
const user_constant_1 = require("../modules/user/user.constant");
const user_model_1 = require("../modules/user/user.model");
const supperAdminData = {
    email: config_1.default.supperAdminEmail,
    password: config_1.default.supperAdminPassword,
    role: user_constant_1.USER_ROLE.superAdmin,
};
const seedSupperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const supperAdminExists = yield user_model_1.userModel.findOne({
        role: user_constant_1.USER_ROLE.superAdmin,
    });
    if (!supperAdminExists) {
        const session = yield mongoose_1.default.startSession();
        try {
            // start transaction
            session.startTransaction();
            // update the user role as a admin
            const createUser = yield user_model_1.userModel.create([supperAdminData], { session });
            if (!createUser[0]) {
                throw new AppError_1.default(400, 'Flailed to create supper admin.');
            }
            // create the admin data
            const adminData = {
                user: createUser[0]._id,
                name: 'Medic Panda',
                photo: '',
                contact: null,
            };
            // create admin in admin model
            const createAdmin = yield admin_model_1.adminModel.create([adminData], {
                session,
            });
            if (!createAdmin.length) {
                throw new AppError_1.default(400, 'Failed to create supper admin.');
            }
            // commit the transaction
            yield session.commitTransaction();
            yield session.endSession();
            return createAdmin[0];
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            console.log(error);
            throw new AppError_1.default(400, 'Something went wrong for create admin. Please try again.');
        }
    }
});
exports.default = seedSupperAdmin;
