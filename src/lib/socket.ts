import { Server as HTTPServer } from 'http';
import { Server, type Socket } from 'socket.io';

let io: Server | null = null;
export const initializeSocket = (httpServer: HTTPServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    console.log('New Client Connected:', socket.id);

    socket.on('join-plant', (plantId: string) => {
      socket.join(plantId);
      console.log(`User joined room: ${plantId}`);
    });

    socket.on('leave-plant', (plantId: string) => {
      socket.leave(plantId);
      console.log(`User left room: ${plantId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client Disconnected');
    });
  });
};

export function getIo() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export const emitPlantUpdate = (io: Server, plantId: string, data: any) => {
  io.to(plantId).emit('plant-status-updated', data);
};
