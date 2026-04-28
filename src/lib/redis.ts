import Redis from 'ioredis';

const redisClient = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', err => console.log('Redis Error', err));

export default redisClient;
