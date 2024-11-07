/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import config from '../config';
import { socketEvent } from './socket.event';

export const userSockets = new Map<string, string>();

let io: Server;

export const initializeSocket = (server: HTTPServer): void => {
  io = new Server(server, {
    cors: {
      origin: config.socketFrontendLink,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.on(socketEvent.connection, (socket) => {
    console.log('A user connected');

    const token = socket?.handshake?.auth?.token;
    let userId: string | null = null;

    if (token) {
      try {
        const decoded: any = jwt.verify(token, config.access_token as string);

        userId = decoded.userId;
      } catch (error) {
        console.error('Invalid token', error);
      }
    }

    if (userId) {
      const userRoom = userId.toString();
      socket.join(userRoom);
      userSockets.set(socket.id, userId);
      console.log(`User ${userId} joined room ${userId}`);
    }

    // Listen for specific events
    socket.on(socketEvent.product, (data: any) => {
      console.log(
        `${socketEvent.product} event received, triggering update.`,
        data,
      );
    });

    socket.on(socketEvent.cart, (data: any) => {
      console.log(
        `${socketEvent.cart} event received, triggering update.`,
        data,
      );
    });

    socket.on(socketEvent.order, (data: any) => {
      console.log(
        `${socketEvent.order} event received, triggering update.`,
        data,
      );
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      userSockets.delete(socket.id); // Remove socket.id from userSockets map
    });
  });
};

export const getSocketIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
