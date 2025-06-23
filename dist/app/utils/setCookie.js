"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = setCookie;
const config_1 = __importDefault(require("../config"));
function setCookie({ res, name, value, maxAge = 24 * 60 * 60 * 1000, options = {}, }) {
    var _a, _b, _c, _d;
    res.cookie(name, value, {
        httpOnly: (_a = options.httpOnly) !== null && _a !== void 0 ? _a : true,
        secure: (_b = options.secure) !== null && _b !== void 0 ? _b : config_1.default.node_env === 'production',
        sameSite: (_c = options.sameSite) !== null && _c !== void 0 ? _c : 'strict',
        path: (_d = options.path) !== null && _d !== void 0 ? _d : '/',
        maxAge,
    });
}
