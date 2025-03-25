import { UserSession, UserState } from '../types';
import { databases } from '../databases/index';
import * as Configs from '../../configs/index';

export class SessionService {
  private static instance: SessionService;
  private readonly keyPrefix: string = 'session:';
  //   private redisClient: Redis;

  private constructor() {}

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return this.instance;
  }

  private getKey(chatId: number): string {
    return `${this.keyPrefix}${chatId}`;
  }

  async initializeSession(chatId: number): Promise<UserSession> {
    try {
      const session: UserSession = {
        chatId,
        state: UserState.IDLE,
        lastCommandAt: Date.now(),
        rateLimitData: {
          requestCount: 0,
          lastResetTime: Date.now(),
        },
      };
      await databases.redis.set(this.getKey(chatId), JSON.stringify(session));

      Configs.logger.info(`Session initialized for chatId: ${chatId}`);

      return session;
    } catch (error) {
      Configs.logger.error(
        `Failed to initialize session for chatId: ${chatId}`,
        error,
      );

      throw error;
    }
  }

  async getSession(chatId: number): Promise<UserSession> {
    try {
      const key = this.getKey(chatId);
      const sessionData = await databases.redis.get(key);
      if (!sessionData) {
        return this.initializeSession(chatId);
      }

      const data = JSON.parse(sessionData);

      return data;
    } catch (error) {
      Configs.logger.error(
        `Failed to get session for chatId: ${chatId}`,
        error,
      );

      return this.initializeSession(chatId);
    }
  }

  async getAllSessions(): Promise<UserSession[]> {
    try {
      const keys = await databases.redis.keys(`${this.keyPrefix}*`);
      const sessions = await databases.redis.mget(keys);

      return sessions.map((session) => JSON.parse(session!!));
    } catch (error) {
      Configs.logger.error('Failed to get all sessions', error);
      return [];
    }
  }

  async updateSession(
    chatId: number,
    sessionUpdate: Partial<UserSession>,
  ): Promise<UserSession> {
    try {
      const session = await this.getSession(chatId);

      const updatedSession = {
        ...session,
        ...sessionUpdate,
        lastCommandAt: Date.now(),
      };

      await databases.redis.set(
        this.getKey(chatId),
        JSON.stringify(updatedSession),
      );

      Configs.logger.info(`Session updated for chatId: ${chatId}`, {
        state: updatedSession.state,
      });

      return updatedSession;
    } catch (error) {
      Configs.logger.error(
        `Failed to update session for chatId: ${chatId}`,
        error,
      );

      throw error;
    }
  }

  async clearSession(chatId: number): Promise<void> {
    try {
      await databases.redis.del(this.getKey(chatId));

      Configs.logger.info(`Session cleared for chatId: ${chatId}`);
    } catch (error) {
      Configs.logger.error(
        `Failed to clear session for chatId: ${chatId}`,
        error,
      );

      throw error;
    }
  }

  async setSessionExpiry(chatId: number, seconds: number): Promise<void> {
    try {
      await databases.redis.expire(this.getKey(chatId), seconds);

      Configs.logger.info(
        `Session expiry set for chatId: ${chatId} for ${seconds} seconds`,
      );
    } catch (error) {
      Configs.logger.error(
        `Failed to set session expiry for chatId: ${chatId}`,
        error,
      );

      throw error;
    }
  }
}
