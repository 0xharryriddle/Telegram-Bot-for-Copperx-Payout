import * as Configs from '../../src/configs';
import { CopperxPayoutService } from './copperxPayout.service';
import { UserModel } from '../models/User.model';

export class WalletService {
  private copperxService: CopperxPayoutService;

  constructor() {
    this.copperxService = new CopperxPayoutService();
  }

  async getWallets(telegramId: number) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const wallets = await this.copperxService.getWallets(user.token);
      
      if (!wallets) {
        return { success: false, message: 'Failed to get wallets' };
      }
      
      return { success: true, wallets };
    } catch (error) {
      Configs.logger.error('Failed to get wallets', { error });
      return { success: false, message: 'Failed to get wallets' };
    }
  }

  async getWalletBalances(telegramId: number) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const balances = await this.copperxService.getWalletBalances(user.token);
      
      if (!balances) {
        return { success: false, message: 'Failed to get wallet balances' };
      }
      
      return { success: true, balances };
    } catch (error) {
      Configs.logger.error('Failed to get wallet balances', { error });
      return { success: false, message: 'Failed to get wallet balances' };
    }
  }

  async getDefaultWallet(telegramId: number) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const defaultWallet = await this.copperxService.getDefaultWallet(user.token);
      
      if (!defaultWallet) {
        return { success: false, message: 'Failed to get default wallet' };
      }
      
      return { success: true, defaultWallet };
    } catch (error) {
      Configs.logger.error('Failed to get default wallet', { error });
      return { success: false, message: 'Failed to get default wallet' };
    }
  }

  async setDefaultWallet(telegramId: number, walletId: string) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const result = await this.copperxService.setDefaultWallet(user.token, walletId);
      
      if (!result) {
        return { success: false, message: 'Failed to set default wallet' };
      }
      
      return { success: true, message: 'Default wallet set successfully' };
    } catch (error) {
      Configs.logger.error('Failed to set default wallet', { error });
      return { success: false, message: 'Failed to set default wallet' };
    }
  }
} 