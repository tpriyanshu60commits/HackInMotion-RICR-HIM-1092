import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL,
        process.env.FRONTEND_URL,
        'http://localhost:5173',
        'https://hack-in-motion-ricr-him-1092.vercel.app'
      ].filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // User joins a room identified by their user ID
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
