import { getSocketIO } from '../socket/socket';

const socketMiddleware = (req, res, next) => {
  console.log(req.path);

  // Emit an event to all connected clients listening for "cart"
  const io = getSocketIO();
  io.emit('order', { message: 'order event triggered via middleware' });

  next();
};

export default socketMiddleware;
