import Pusher from 'pusher';
import createDebug from 'debug';

const debug = createDebug('bot:notification_service');

interface PusherConfig {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
}

interface DepositData {
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
  transactionId: string;
  network?: string;
}

interface PusherAuthResponse {
  success: boolean;
  auth?: string;
}

class NotificationService {
  private static pusher: Pusher;

  private static initializePusher() {
    if (!this.pusher) {
      this.pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID || '',
        key: process.env.PUSHER_KEY || '',
        secret: process.env.PUSHER_SECRET || '',
        cluster: process.env.PUSHER_CLUSTER || '',
        useTLS: true
      });
    }
    return this.pusher;
  }

  static getPusherConfig(): PusherConfig {
    return {
      appId: process.env.PUSHER_APP_ID || '',
      key: process.env.PUSHER_KEY || '',
      secret: process.env.PUSHER_SECRET || '',
      cluster: process.env.PUSHER_CLUSTER || ''
    };
  }

  static async authenticatePusher(
    userId: number,
    socketId: string,
    channelName: string
  ): Promise<PusherAuthResponse> {
    try {
      const pusher = this.initializePusher();
      const auth = pusher.authorizeChannel(socketId, channelName);
      return { success: true, auth: JSON.stringify(auth) };
    } catch (error) {
      debug('Error authenticating Pusher:', error);
      return { success: false };
    }
  }

  static async subscribeToDeposits(userId: string, callback: (data: DepositData) => void): Promise<boolean> {
    try {
      const pusher = this.initializePusher();
      const channelName = `private-deposits-${userId}`;
      
      // Trigger a test event to ensure the channel exists
      await pusher.trigger(channelName, 'test', {});
      
      // Store the callback for later use
      const eventHandler = (data: DepositData) => {
        debug(`Received deposit notification for user ${userId}:`, data);
        callback(data);
      };

      // Bind to the deposit event
      await pusher.trigger(channelName, 'client-deposit', eventHandler);

      return true;
    } catch (error) {
      debug('Error subscribing to deposits:', error);
      return false;
    }
  }

  static async unsubscribeFromDeposits(userId: string): Promise<boolean> {
    try {
      const pusher = this.initializePusher();
      const channelName = `private-deposits-${userId}`;
      
      // Unbind from the deposit event
      await pusher.trigger(channelName, 'client-deposit', null);

      return true;
    } catch (error) {
      debug('Error unsubscribing from deposits:', error);
      return false;
    }
  }
}

export { NotificationService, DepositData }; 