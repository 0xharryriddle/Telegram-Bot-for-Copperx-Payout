import { createClient } from 'redis';
import * as Configs from '../configs';

const client = createClient({
  url: Configs.ENV.REDIS_URL,
});

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('error', (error) => {
  console.error(error);
});

module.exports = client;
