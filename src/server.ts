import app from './app';
import http, { Server } from 'http';
import config from './config';
import { initializeSocket } from './lib/socket';

let server: Server;

const serverInstance = http.createServer(app);

// Initialize socket
initializeSocket(serverInstance);

process.on('uncaughtException', error => {
  console.log(error);
  process.exit(1);
});

process.on('unhandledRejection', error => {
  if (server) {
    server.close(() => {
      console.log(error);
      process.exit(1);
    });
  }
});

process.on('SIGTERM', () => {
  if (server) {
    server.close(() => {
      console.log('Process terminated');
    });
  }
});

async function startServer() {
  try {
    server = serverInstance.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log('Error while connecting database: ', error);
  }
}

startServer();
