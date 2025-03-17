import * as Configs from '../../src/configs';
import { UserModel } from '../models/User.model';
import axios from 'axios';

export class NotificationService {
  private pusherKey = 'e089376087cac1a62785';
  private pusherCluster = 'ap1';

  async authenticatePusher(telegramId: number, socketId: string, channelName: string) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
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
            Authorization: `Bearer ${user.token}`
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