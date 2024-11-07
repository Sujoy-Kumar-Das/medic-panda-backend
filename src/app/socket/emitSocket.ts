/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSocketIO } from './socket';

export const emitSocketEvent = (event: string, data: any, userId: string) => {
  const io = getSocketIO();

  if (io) {
    io.to(userId.toString()).emit(event, data); // Emit to the specific user room
  } else {
    console.warn(`Failed to emit socket event: ${event}`);
  }
};
