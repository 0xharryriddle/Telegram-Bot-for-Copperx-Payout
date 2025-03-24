import Redis from 'ioredis';
import createDebug from 'debug';

import { RedisDatabase } from './redis';

const debug = createDebug('database:redis');

export interface Databases {
  redis: Redis;
}

const redisDatabase = new RedisDatabase();

export const setUp = async () => {
  const isConnected = await redisDatabase.ping();
  if (!isConnected) {
    debug('Failed to connect to databases!');
    throw new Error('Failed to connect to databases!');
  }
  debug('Databases connected successfully!');
};

export const databases: Databases = {
  redis: redisDatabase.getRedisClient(),
};
