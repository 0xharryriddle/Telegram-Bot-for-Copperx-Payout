import Redis, { RedisOptions } from 'ioredis';
import createDebug from 'debug';

import * as Configs from '../../configs/index';

const debug = createDebug('database:redis');

export class RedisDatabase {
  private redisClient: Redis;

  constructor() {
    const options: RedisOptions = {
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 500, 2000);
        return delay;
      },
      maxRetriesPerRequest: 10,
      enableReadyCheck: true,
      connectTimeout: 15000,
      keepAlive: 30000,
      family: 4,
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    };

    this.redisClient = new Redis(Configs.ENV.REDIS_URL, options);

    this.redisClient.on('connect', () => {
      debug('Connected to Redis successfully!');
    });

    this.redisClient.on('error', (err) => {
      debug('Redis Error:', err);
    });

    this.redisClient.on('close', () => {
      debug('Redis connection closed!');
    });

    this.redisClient.on('reconnecting', () => {
      debug('Attempting to reconnect to Redis...');
    });
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.redisClient.ping();
      return result === 'PONG';
    } catch (error) {
      debug('Error pinging Redis:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.redisClient.status !== 'close') {
        await this.redisClient.quit();
      }
      debug('Disconnected from Redis');
    } catch (error) {
      debug('Error disconnecting from Redis:', error);
    }
  }

  getRedisClient(): Redis {
    if (!this.redisClient) {
      return new Redis(Configs.ENV.REDIS_URL);
    }
    return this.redisClient;
  }
}
