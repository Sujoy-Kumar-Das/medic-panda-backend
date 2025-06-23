"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketIO = exports.initializeSocket = exports.userSockets = void 0;
const socket_io_1 = require("socket.io");
const config_1 = __importDefault(require("../config"));
const socket_event_1 = require("./socket.event");
exports.userSockets = new Map();
let io;
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: config_1.default.socketFrontendLink,
            credentials: true,
            methods: ['GET', 'POST'],
        },
        transports: ['websocket', 'polling'],
    });
    io.on(socket_event_1.socketEvent.connection, (socket) => {
        console.log('A user connected from connection', socket.id);
        // const token = socket?.handshake?.auth?.token;
        const userId = socket.id;
        // if (token) {
        //   try {
        //     const decoded: any = jwt.verify(token, config.access_token as string);
        //     userId = decoded.userId;
        //   } catch (error) {
        //     console.error('Invalid token', error);
        //     userId = null;
        //   }
        // }
        // if (userId) {
        //   const userRoom = userId.toString();
        //   socket.join(userRoom);
        //   userSockets.set(socket.id, userId);
        //   console.log(`User ${userId} joined room ${userId}`);
        // }
        // Listen for specific events
        socket.on(socket_event_1.socketEvent.product, (data) => {
            console.log(`${socket_event_1.socketEvent.product} event received, triggering update.`, data);
        });
        socket.on(socket_event_1.socketEvent.cart, (data) => {
            console.log(`${socket_event_1.socketEvent.cart} event received, triggering update.`, data);
        });
        socket.on(socket_event_1.socketEvent.order, (data) => {
            console.log(`${socket_event_1.socketEvent.order} event received, triggering update.`, data);
        });
        // Cleanup on disconnect
        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
            exports.userSockets.delete(socket.id); // Remove socket.id from userSockets map
        });
    });
};
exports.initializeSocket = initializeSocket;
const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
exports.getSocketIO = getSocketIO;
