/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSocketIO } from './socket';

export const emitSocketEvents = (
  events: { event: string; data: any; userId?: string }[],
) => {
  const io = getSocketIO();

  if (io) {
    events.forEach(({ event, data, userId }) => {
      console.warn(`Emitting socket event: ${event}`);
      if (userId) {
        io.to(userId.toString()).emit(event, data);
      } else {
        io.emit(event, data);
      }
    });
  } else {
    console.warn(
      'Failed to emit socket events: Socket.io instance not available.',
    );
  }
};
