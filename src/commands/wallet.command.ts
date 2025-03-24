import { Context } from 'telegraf';
import { Update } from 'telegraf/types';

import { WalletService } from '../api/services/wallet.service';
import { AuthService } from '../api/services/auth.service';

export class WalletCommands {
  private walletService: WalletService;
  private authService: AuthService;

  constructor(context: Context<Update>) {
    this.walletService = WalletService.getInstance(context);
    this.authService = AuthService.getInstance(context);
  }

  async getWalletInfo(ctx: Context) {
    try {
    } catch (error) {
      await ctx.reply('Failed to get wallet information. Please try again.');
    }
  }
}
