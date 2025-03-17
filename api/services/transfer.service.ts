import * as Configs from '../../src/configs';
import { CopperxPayoutService } from './copperxPayout.service';
import { UserModel } from '../models/User.model';

export class TransferService {
  private copperxService: CopperxPayoutService;

  constructor() {
    this.copperxService = new CopperxPayoutService();
  }

  async getTransactionHistory(telegramId: number, page = 1, limit = 10) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const history = await this.copperxService.getTransactionHistory(user.token, page, limit);
      
      if (!history) {
        return { success: false, message: 'Failed to get transaction history' };
      }
      
      return { success: true, history };
    } catch (error) {
      Configs.logger.error('Failed to get transaction history', { error });
      return { success: false, message: 'Failed to get transaction history' };
    }
  }

  async sendFundsToEmail(telegramId: number, email: string, amount: number, currency: string, message?: string) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const result = await this.copperxService.sendFundsToEmail(user.token, email, amount, currency, message);
      
      if (!result) {
        return { success: false, message: 'Failed to send funds' };
      }
      
      return { success: true, message: 'Funds sent successfully', transaction: result };
    } catch (error) {
      Configs.logger.error('Failed to send funds', { error });
      return { success: false, message: 'Failed to send funds' };
    }
  }

  async sendFundsToWallet(telegramId: number, address: string, amount: number, currency: string, network: string) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const result = await this.copperxService.sendFundsToWallet(user.token, address, amount, currency, network);
      
      if (!result) {
        return { success: false, message: 'Failed to send funds to wallet' };
      }
      
      return { success: true, message: 'Funds sent to wallet successfully', transaction: result };
    } catch (error) {
      Configs.logger.error('Failed to send funds to wallet', { error });
      return { success: false, message: 'Failed to send funds to wallet' };
    }
  }

  async withdrawToBank(telegramId: number, amount: number, currency: string) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const result = await this.copperxService.withdrawToBank(user.token, amount, currency);
      
      if (!result) {
        return { success: false, message: 'Failed to withdraw to bank' };
      }
      
      return { success: true, message: 'Withdrawal to bank initiated successfully', transaction: result };
    } catch (error) {
      Configs.logger.error('Failed to withdraw to bank', { error });
      return { success: false, message: 'Failed to withdraw to bank' };
    }
  }
} 