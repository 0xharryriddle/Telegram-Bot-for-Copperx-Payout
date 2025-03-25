import Pusher from 'pusher-js';

import * as Configs from '../../configs';
import { CopperxPayoutService } from './copperxPayout.service';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/types';

export class NotificationService {
  private static instance: NotificationService;
  private copperxPayoutService: CopperxPayoutService;
  private pusherKey: string;
  private pusherCluster: string;
  private pusherClient?: Pusher;

  private constructor() {
    this.copperxPayoutService = new CopperxPayoutService();
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

  async initializeClient(accessToken: string): Promise<void> {
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
  }

  async getClient(accessToken: string): Promise<Pusher | undefined> {
    if (!this.pusherClient) {
      await this.initializeClient(accessToken);
    }
    return this.pusherClient;
  }

  async subscribePrivateChannel(
    accessToken: string,
    organizationId: string,
    context: Context<Update>,
  ) {
    const pusherClient = await this.getClient(accessToken);
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
}
