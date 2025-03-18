import { Context } from 'telegraf';
import { Message } from 'telegraf/types';
import { AuthService } from '../services/auth.service';
import { CopperxPayoutService } from '../services/copperxPayout.service';

interface Wallet {
  balance: string;
  currency: string;
  status: string;
  lastUpdated: string;
}

export class WalletCommands {
  private authService: AuthService;
  private copperxService: CopperxPayoutService;

  constructor() {
    this.authService = new AuthService();
    this.copperxService = new CopperxPayoutService();
  }

  async getWalletInfo(ctx: Context) {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        await ctx.reply('Could not identify user.');
        return;
      }

      const message = ctx.message as Message.TextMessage;
      const email = message.text?.split(' ')[1]?.trim() || undefined;

      const profile = await this.authService.getUserProfile(telegramId, email);
      if (!profile.success) {
        await ctx.reply(profile.message || 'Failed to get user profile.');
        return;
      }

      const wallets = await this.copperxService.getWallets(profile.profile.token);
      if (!wallets || wallets.length === 0) {
        await ctx.reply('No wallet information available.');
        return;
      }

      const walletInfo = wallets.map((wallet: Wallet) => 
        `Wallet Information:\n\n` +
        `Balance: ${wallet.balance} ${wallet.currency}\n` +
        `Status: ${wallet.status}\n` +
        `Last Updated: ${new Date(wallet.lastUpdated).toLocaleString()}`
      ).join('\n\n');

      await ctx.reply(walletInfo);
    } catch (error) {
      await ctx.reply('Failed to get wallet information. Please try again.');
    }
  }
} 