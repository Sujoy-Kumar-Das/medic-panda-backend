"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitSocketEvents = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const socket_1 = require("./socket");
const emitSocketEvents = (events) => {
    const io = (0, socket_1.getSocketIO)();
    if (io) {
        events.forEach(({ event, data, userId }) => {
            console.warn(`Emitting socket event: ${event}`);
            if (userId) {
                io.to(userId.toString()).emit(event, data);
            }
            else {
                io.emit(event, data);
            }
        });
    }
    else {
        console.warn('Failed to emit socket events: Socket.io instance not available.');
    }
};
exports.emitSocketEvents = emitSocketEvents;
