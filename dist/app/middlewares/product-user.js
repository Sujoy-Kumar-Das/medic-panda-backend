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
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const verifyJwtToken_1 = __importDefault(require("../utils/verifyJwtToken"));
const ANONYMOUS_USER = { email: '', role: '', userId: '' };
const productUser = () => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.accessToken;
    if (!token) {
        req.user = ANONYMOUS_USER;
        return next();
    }
    try {
        const decoded = (0, verifyJwtToken_1.default)(token, config_1.default.access_token);
        const { userId, iat } = decoded;
        const user = yield user_model_1.userModel.findUserWithID(userId);
        const isInvalid = !user ||
            user.isBlocked ||
            user.isDeleted ||
            (user.passwordChangeAt &&
                user_model_1.userModel.isJwtIssuedBeforePasswordChange(user.passwordChangeAt, iat));
        if (isInvalid) {
            req.user = ANONYMOUS_USER;
        }
        else {
            req.user = { email: user.email, role: user.role, userId: user._id };
        }
    }
    catch (_a) {
        req.user = ANONYMOUS_USER;
    }
    next();
}));
exports.default = productUser;
