import * as Configs from '../../src/configs';
import { CopperxPayoutService } from './copperxPayout.service';
import { UserEmailModel } from '../models/UserEmail.model';

export class TransferService {
  private copperxService: CopperxPayoutService;

  constructor() {
    this.copperxService = new CopperxPayoutService();
  }

  async getTransactionHistory(telegramId: number, page = 1, limit = 10, email?: string) {
    try {
      const userEmail = await UserEmailModel.findOne(
        email 
          ? { telegramId, email }
          : { telegramId, isDefault: true }
      );
      
      if (!userEmail || !userEmail.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const history = await this.copperxService.getTransactionHistory(userEmail.token, page, limit);
      
      if (!history) {
        return { success: false, message: 'Failed to get transaction history' };
      }
      
      return { success: true, history };
    } catch (error) {
      Configs.logger.error('Failed to get transaction history', { error });
      return { success: false, message: 'Failed to get transaction history' };
    }
  }

  async sendFundsToEmail(telegramId: number, recipientEmail: string, amount: number, currency: string, message?: string, senderEmail?: string) {
    try {
      const userEmail = await UserEmailModel.findOne(
        senderEmail 
          ? { telegramId, email: senderEmail }
          : { telegramId, isDefault: true }
      );
      
      if (!userEmail || !userEmail.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const result = await this.copperxService.sendFundsToEmail(userEmail.token, recipientEmail, amount, currency, message);
      
      if (!result) {
        return { success: false, message: 'Failed to send funds' };
      }
      
      return { success: true, message: 'Funds sent successfully', transaction: result };
    } catch (error) {
      Configs.logger.error('Failed to send funds', { error });
      return { success: false, message: 'Failed to send funds' };
    }
  }

  async sendFundsToWallet(telegramId: number, address: string, amount: number, currency: string, network: string, email?: string) {
    try {
      const userEmail = await UserEmailModel.findOne(
        email 
          ? { telegramId, email }
          : { telegramId, isDefault: true }
      );
      
      if (!userEmail || !userEmail.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const result = await this.copperxService.sendFundsToWallet(userEmail.token, address, amount, currency, network);
      
      if (!result) {
        return { success: false, message: 'Failed to send funds to wallet' };
      }
      
      return { success: true, message: 'Funds sent to wallet successfully', transaction: result };
    } catch (error) {
      Configs.logger.error('Failed to send funds to wallet', { error });
      return { success: false, message: 'Failed to send funds to wallet' };
    }
  }

  async withdrawToBank(telegramId: number, amount: number, currency: string, email?: string) {
    try {
      const userEmail = await UserEmailModel.findOne(
        email 
          ? { telegramId, email }
          : { telegramId, isDefault: true }
      );
      
      if (!userEmail || !userEmail.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const result = await this.copperxService.withdrawToBank(userEmail.token, amount, currency);
      
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