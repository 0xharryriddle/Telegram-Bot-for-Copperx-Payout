import createDebug from 'debug';
import { Telegraf } from 'telegraf';
import Pusher from 'pusher-js';
import { UserModel } from '../../../api/models/User.model';
import { NotificationService, DepositData } from '../../services/notification.service';
import MyContext from '../../contexts';
import { Update } from 'telegraf/typings/core/types/typegram';

const debug = createDebug('bot:deposit_notification');

// Map to store user's Pusher subscriptions
const userSubscriptions = new Map<number, Pusher>();

interface IUser {
  telegramId: number;
  organizationId?: string;
  userId: string;
  isAuthenticated: boolean;
  token?: string;
}

const setupDepositNotifications = (bot: Telegraf<MyContext<Update>>) => {
  debug('Setting up deposit notifications');
  
  // Setup Pusher for each authenticated user
  setInterval(async () => {
    try {
      // Find all authenticated users
      const users = await UserModel.find({ isAuthenticated: true, token: { $ne: null } }) as IUser[];
      
      for (const user of users) {
        const telegramId = user.telegramId;
        
        // Skip if already subscribed
        if (userSubscriptions.has(telegramId)) {
          continue;
        }
        
        const config = NotificationService.getPusherConfig();
        
        // Initialize Pusher client
        const pusher = new Pusher(config.key, {
          cluster: config.cluster,
          authorizer: (channel) => ({
            authorize: async (socketId, callback) => {
              try {
                const response = await NotificationService.authenticatePusher(
                  telegramId,
                  socketId,
                  channel.name
                );
                
                if (response.success && response.auth) {
                  callback(null, { auth: response.auth });
                } else {
                  callback(new Error('Pusher authentication failed'), null);
                }
              } catch (error) {
                debug('Pusher authorization error:', error);
                callback(error as Error, null);
              }
            }
          })
        });
        
        // Subscribe to organization's private channel
        const organizationId = user.organizationId || 'default';
        const channel = pusher.subscribe(`private-org-${organizationId}`);
        
        channel.bind('pusher:subscription_succeeded', () => {
          debug(`Successfully subscribed to private channel for user ${telegramId}`);
        });
        
        channel.bind('pusher:subscription_error', (error: any) => {
          debug(`Subscription error for user ${telegramId}:`, error);
        });
        
        // Bind to the deposit event
        channel.bind('client-deposit', (data: DepositData) => {
          bot.telegram.sendMessage(
            telegramId,
            `💰 *New Deposit Received*\n\n` +
            `${data.amount} ${data.currency || 'USDC'} deposited\n\n` +
            `Transaction ID: \`${data.transactionId || 'N/A'}\``,
            { parse_mode: 'Markdown' }
          );
        });
        
        // Store the subscription
        userSubscriptions.set(telegramId, pusher);
      }
    } catch (error) {
      debug('Error setting up deposit notifications:', error);
    }
  }, 60000); // Check every minute
};

const cleanupDepositNotifications = () => {
  debug('Cleaning up deposit notifications');
  
  // Disconnect all Pusher clients
  for (const [telegramId, pusher] of userSubscriptions.entries()) {
    pusher.disconnect();
    userSubscriptions.delete(telegramId);
  }
};

const depositNotification = () => async (ctx: MyContext<Update>) => {
  try {
    const user = await UserModel.findOne({ telegramId: ctx.from?.id }) as IUser | null;
    
    if (!user) {
      await ctx.reply('❌ Please login first using /login command.');
      return;
    }

    const success = await NotificationService.subscribeToDeposits(user.userId, async (data: DepositData) => {
      const message = `💰 *New Deposit Received!*

Amount: ${data.amount} ${data.currency}
Status: ${data.status}
Time: ${new Date(data.timestamp).toLocaleString()}

Transaction ID: \`${data.transactionId}\``;

      await ctx.reply(message, { parse_mode: 'Markdown' });
    });

    if (success) {
      await ctx.reply('✅ Successfully subscribed to deposit notifications! You will receive notifications for all new deposits.');
    } else {
      await ctx.reply('❌ Failed to subscribe to deposit notifications. Please try again later.');
    }
  } catch (error) {
    debug('Error in deposit notification command:', error);
    await ctx.reply('❌ An error occurred while setting up deposit notifications. Please try again later.');
  }
};

export { setupDepositNotifications, cleanupDepositNotifications, depositNotification }; 