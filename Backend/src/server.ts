import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import dotenv from 'dotenv';
import logger from './utils/logger';
import prisma from './utils/prisma';

dotenv.config();

const port = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.io setup
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  logger.info('A user connected', { socketId: socket.id });

  socket.on('disconnect', () => {
    logger.info('User disconnected', { socketId: socket.id });
  });
});

// Start Server
const startServer = async () => {
  try {
    // Explicitly test the connection
    await prisma.$connect();

    server.listen(port, () => {
      logger.info(`🚀 Server is live on port ${port}`);
    });
  } catch (error) {
    logger.error(' Failed to connect to database:', error);
    process.exit(1);
  }
};


startServer();
