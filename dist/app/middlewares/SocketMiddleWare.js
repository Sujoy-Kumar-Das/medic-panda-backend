"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../socket/socket");
const socketMiddleware = (req, res, next) => {
    // Emit an event to all connected clients listening for "cart"
    const io = (0, socket_1.getSocketIO)();
    io.emit('order', { message: 'order event triggered via middleware' });
    next();
};
exports.default = socketMiddleware;
