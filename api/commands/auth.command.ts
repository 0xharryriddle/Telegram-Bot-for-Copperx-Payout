import { Context } from 'telegraf';
import { Message } from 'telegraf/types';
import { AuthService } from '../services/auth.service';

export class AuthCommands {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async verifyOtp(ctx: Context) {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        await ctx.reply('Could not identify user.');
        return;
      }

      const message = ctx.message as Message.TextMessage;
      const otp = message.text?.split(' ')[1]?.trim();
      if (!otp) {
        await ctx.reply('Please provide an OTP code.\nUsage: /otp <code>');
        return;
      }

      const result = await this.authService.verifyOtp(telegramId, otp);
      if (result.success) {
        await ctx.reply(`${result.message || 'Authentication successful.'}\nEmail: ${result.email}`);
      } else {
        await ctx.reply(result.message || 'Failed to verify OTP.');
      }
    } catch (error) {
      await ctx.reply('Failed to verify OTP. Please try again.');
    }
  }
} 