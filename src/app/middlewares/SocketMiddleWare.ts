import { NextFunction, Request, Response } from 'express';
import { getSocketIO } from '../socket/socket';

const socketMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Emit an event to all connected clients listening for "cart"
  const io = getSocketIO();
  io.emit('order', { message: 'order event triggered via middleware' });

  next();
};

export default socketMiddleware;
