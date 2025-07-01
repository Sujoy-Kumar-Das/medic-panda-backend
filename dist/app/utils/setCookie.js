"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = setCookie;
function setCookie({ res, name, value }) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
    };
    res.cookie(name, value, cookieOptions);
}
