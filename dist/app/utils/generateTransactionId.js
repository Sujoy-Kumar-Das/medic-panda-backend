"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `${timestamp}${random}`;
};
exports.default = generateTransactionId;
