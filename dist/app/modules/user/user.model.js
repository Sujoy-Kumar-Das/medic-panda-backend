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
exports.userModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const hashPassword_1 = __importDefault(require("../../utils/hashPassword"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        index: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superAdmin'],
        default: 'user',
    },
    isBlocked: {
        type: Boolean,
        default: false,
        select: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false,
    },
    passwordChangeAt: {
        type: Date,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otpCode: {
        type: Number,
        default: null,
        select: false,
    },
    otpTime: {
        type: Date,
        default: null,
        select: false,
    },
    wrongOTPAttempt: {
        type: Number,
        default: 0,
        select: false,
    },
    resetTime: {
        type: Date,
        default: null,
        select: false,
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// using virtuals for link customer to user
userSchema.virtual('customer', {
    ref: 'customer',
    localField: '_id',
    foreignField: 'user',
    justOne: true,
});
// is user exists statics
userSchema.statics.isUserExists = function (email) {
    return exports.userModel
        .findOne({ email })
        .select('+isBlocked +isDeleted +passwordChangeAt +otpCode +otpTime +wrongOTPAttempt +resetTime');
};
// find user by id
userSchema.statics.findUserWithID = function (id, session) {
    return exports.userModel
        .findById(id)
        .select('+isBlocked +isDeleted +passwordChangeAt +otpCode +otpTime +wrongOTPAttempt +resetTime')
        .session(session || null);
};
// is password matched method
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
// is jwt issued before password change method
userSchema.statics.isJwtIssuedBeforePasswordChange = function (passwordChangeAt, jwtIssuedTime) {
    const passwordChangeTime = new Date(passwordChangeAt).getTime() / 1000;
    return jwtIssuedTime < passwordChangeTime;
};
// hash password middleware
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this;
        // hashing password and save into DB
        user.password = yield (0, hashPassword_1.default)(user.password);
        next();
    });
});
exports.userModel = (0, mongoose_1.model)('user', userSchema);
