"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = setCookie;
function setCookie({ res, name, value, maxAge = 24 * 60 * 60 * 1000, // Default: 24 hours
 }) {
    const isProduction = process.env.NODE_ENV === 'production';
    // Cookie options optimized for production
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction, // Only use HTTPS in production
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge,
        // Don't set domain - let browser handle it automatically
        // This works for both localhost and production domains
    };
    res.cookie(name, value, cookieOptions);
}
