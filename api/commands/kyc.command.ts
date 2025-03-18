import { Context } from 'telegraf';
import { Message } from 'telegraf/types';
import { AuthService } from '../services/auth.service';

interface KYCStatus {
  status: string;
  level: string;
  lastUpdated: string;
}

export class KYCCommands {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async getKYCStatus(ctx: Context) {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        await ctx.reply('Could not identify user.');
        return;
      }

      const message = ctx.message as Message.TextMessage;
      const email = message.text?.split(' ')[1]?.trim() || undefined;

      const result = await this.authService.getKYCStatus(telegramId, email);
      if (!result.success) {
        await ctx.reply(result.message || 'Failed to get KYC status.');
        return;
      }

      const kycInfo = `KYC Status:\n\n` +
        `Status: ${result.kycStatus.status}\n` +
        `Level: ${result.kycStatus.level}\n` +
        `Last Updated: ${new Date(result.kycStatus.lastUpdated).toLocaleString()}`;

      await ctx.reply(kycInfo);
    } catch (error) {
      await ctx.reply('Failed to get KYC status. Please try again.');
    }
  }
} 