import * as Configs from '../../src/configs';
import { UserEmailModel } from '../models/UserEmail.model';
import axios from 'axios';

export class NotificationService {
  private pusherKey = Configs.ENV.PUSHER_KEY;
  private pusherCluster = Configs.ENV.PUSHER_CLUSTER;

  async authenticatePusher(telegramId: number, socketId: string, channelName: string, email?: string) {
    try {
      // Get the specified email or default email
      const userEmail = await UserEmailModel.findOne(
        email 
          ? { telegramId, email }
          : { telegramId, isDefault: true }
      );
      
      if (!userEmail || !userEmail.token) {
        return { success: false, message: 'Please login first' };
      }
      
      // Authenticate with Copperx Payout's Pusher
      const response = await axios.post(
        `${Configs.ENV.BASE_URL}/notifications/auth`,
        {
          socket_id: socketId,
          channel_name: channelName
        },
        {
          headers: {
            Authorization: `Bearer ${userEmail.token}`,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );
      
      if (!response.data) {
        return { success: false, message: 'Pusher authentication failed' };
      }
      
      return { success: true, auth: response.data };
    } catch (error) {
      Configs.logger.error('Pusher authentication failed', { error });
      return { success: false, message: 'Pusher authentication failed' };
    }
  }

  getPusherConfig() {
    return {
      key: this.pusherKey,
      cluster: this.pusherCluster
    };
  }
} 