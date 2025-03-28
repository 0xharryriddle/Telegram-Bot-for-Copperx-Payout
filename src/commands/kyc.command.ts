import { Context } from 'telegraf';
import { AuthService } from '../api/services/auth.service';

export class KYCCommands {
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  async getKYCStatus(ctx: Context) {
    try {
      const chatId = ctx.chat?.id;
      if (!chatId) {
        await ctx.reply('Could not identify user.');
        return;
      }
      const result = await this.authService.isVerified(chatId);

      await ctx.reply(result ? 'Verified' : 'Not verified');
    } catch (error) {
      await ctx.reply('Failed to get KYC status. Please try again.');
    }
  }
}
