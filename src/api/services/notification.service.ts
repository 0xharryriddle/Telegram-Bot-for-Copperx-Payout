import Pusher, { Channel } from 'pusher-js';

import * as Configs from '../../configs';
import { CopperxPayoutService } from './copperxPayout.service';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/types';
import { SessionService } from './session.service';

export class NotificationService {
  private static instance: NotificationService;
  private copperxPayoutService: CopperxPayoutService;
  private sessionService: SessionService;
  private pusherKey: string;
  private pusherCluster: string;
  private pusherClient?: Pusher;
  private channelSubscriptions: Record<string, Channel> = {};

  private constructor() {
    this.copperxPayoutService = new CopperxPayoutService();
    this.sessionService = SessionService.getInstance();
    this.pusherKey = Configs.ENV.PUSHER_KEY;
    this.pusherCluster = Configs.ENV.PUSHER_CLUSTER;
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return this.instance;
  }

  /* -------------------------- Deposit Notifications ------------------------- */

  async initializeClient(
    accessToken: string,
    organizationId: string,
  ): Promise<boolean> {
    if (this.channelSubscriptions[organizationId]) {
      Configs.logger.info(
        `Channel for organization ${organizationId} already exists`,
      );
      return true;
    }
    this.pusherClient = new Pusher(this.pusherKey, {
      cluster: this.pusherCluster,
      authorizer: (channel) => ({
        authorize: (socketId, callback) =>
          this.copperxPayoutService.notificationAuth(
            accessToken,
            {
              socket_id: socketId,
              channel_name: channel.name,
            },
            callback,
          ),
      }),
    });
    return true;
  }

  async getClient(
    accessToken: string,
    organizationId: string,
  ): Promise<Pusher | undefined> {
    if (!this.pusherClient) {
      await this.initializeClient(accessToken, organizationId);
    }
    return this.pusherClient;
  }

  async subscribePrivateChannel(
    accessToken: string,
    organizationId: string,
    context: Context<Update>,
  ) {
    const pusherClient = await this.getClient(accessToken, organizationId);
    const channel = pusherClient?.subscribe(`private-org-${organizationId}`);

    channel?.bind('pusher:subscription_succeeded', () => {
      Configs.logger.info(
        `'Successfully subscribed to private channel': ${organizationId}`,
      );
    });

    channel?.bind(
      'pusher:subscription_error',
      (error: Error | null | undefined) => {
        Configs.logger.error(
          `'Failed to subscribe to private channel': ${organizationId}`,
          error,
        );
      },
    );

    // Bind to the deposit event
    pusherClient?.bind('deposit', (data: any) => {
      Configs.logger.info(`New Deposit Received`, data);
      context.sendMessage?.(
        `💰 *New Deposit Received*\n\n` + `${data.amount} deposited`,
      );
    });
  }

  async subscribeForAll(context: Context<Update>) {
    try {
      const sessions = await this.sessionService.getAllSessions();

      for (const session of sessions) {
        if (
          session.authData?.accessToken &&
          session.organizationId &&
          new Date(session.authData.expireAt!!) > new Date()
        ) {
          await this.subscribePrivateChannel(
            session.authData.accessToken,
            session.organizationId,
            context,
          );
        }
      }
    } catch (error) {}
  }

  unsubscribe(organizationId: string): void {
    if (this.pusherClient && this.channelSubscriptions[organizationId]) {
      this.pusherClient.unsubscribe(`private-org-${organizationId}`);
      delete this.channelSubscriptions[organizationId];
      Configs.logger.info(
        `Unsubscribed from channel for organization ${organizationId}`,
      );
    }
  }
}
