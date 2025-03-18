import { Context } from 'telegraf';
import { Message } from 'telegraf/types';
import { AuthService } from '../services/auth.service';
import { validateEmail } from '../utils/validation';

interface EmailInfo {
  email: string;
  isAuthenticated: boolean;
  isDefault: boolean;
  lastLoginTime?: Date;
}

export class EmailCommands {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async listEmails(ctx: Context) {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        await ctx.reply('Could not identify user.');
        return;
      }

      const result = await this.authService.listEmails(telegramId);
      
      if (!result.success || !result.emails) {
        await ctx.reply(result.message || 'Failed to list emails.');
        return;
      }

      if (result.emails.length === 0) {
        await ctx.reply('You have no registered emails.');
        return;
      }

      const emailList = result.emails.map((email: EmailInfo) => {
        const status = email.isAuthenticated ? '🟢 Logged in' : '🔴 Logged out';
        const defaultMark = email.isDefault ? ' (Default)' : '';
        const lastLogin = email.lastLoginTime 
          ? `\nLast login: ${email.lastLoginTime.toLocaleString()}`
          : '';
        return `${email.email}${defaultMark}\nStatus: ${status}${lastLogin}`;
      }).join('\n\n');

      await ctx.reply(
        'Your registered emails:\n\n' + emailList + 
        '\n\nCommands:\n/login <email> - Login with specific email\n/setdefault <email> - Set default email\n/logout <email> - Logout specific email'
      );
    } catch (error) {
      await ctx.reply('Failed to list emails. Please try again.');
    }
  }

  async setDefaultEmail(ctx: Context) {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        await ctx.reply('Could not identify user.');
        return;
      }

      const message = ctx.message as Message.TextMessage;
      const email = message.text?.split(' ')[1]?.trim();
      if (!email) {
        await ctx.reply('Please provide an email address.\nUsage: /setdefault <email>');
        return;
      }

      if (!validateEmail(email)) {
        await ctx.reply('Please provide a valid email address.');
        return;
      }

      const result = await this.authService.setDefaultEmail(telegramId, email);
      await ctx.reply(result.message || 'Failed to set default email.');
    } catch (error) {
      await ctx.reply('Failed to set default email. Please try again.');
    }
  }

  async loginWithEmail(ctx: Context) {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        await ctx.reply('Could not identify user.');
        return;
      }

      const message = ctx.message as Message.TextMessage;
      const email = message.text?.split(' ')[1]?.trim();
      if (!email) {
        await ctx.reply('Please provide an email address.\nUsage: /login <email>');
        return;
      }

      if (!validateEmail(email)) {
        await ctx.reply('Please provide a valid email address.');
        return;
      }

      const result = await this.authService.emailOtpRequest(email, telegramId);
      await ctx.reply(result.message || 'Failed to initiate login.');
    } catch (error) {
      await ctx.reply('Failed to initiate login. Please try again.');
    }
  }

  async logoutEmail(ctx: Context) {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        await ctx.reply('Could not identify user.');
        return;
      }

      const message = ctx.message as Message.TextMessage;
      const email = message.text?.split(' ')[1]?.trim();
      if (!email) {
        await ctx.reply('Please provide an email address.\nUsage: /logout <email>\nOr use /logoutall to logout from all emails');
        return;
      }

      if (!validateEmail(email)) {
        await ctx.reply('Please provide a valid email address.');
        return;
      }

      const result = await this.authService.logout(telegramId, email);
      await ctx.reply(result.message || 'Failed to logout.');
    } catch (error) {
      await ctx.reply('Failed to logout. Please try again.');
    }
  }

  async logoutAll(ctx: Context) {
    try {
      const telegramId = ctx.from?.id;
      if (!telegramId) {
        await ctx.reply('Could not identify user.');
        return;
      }

      const result = await this.authService.logout(telegramId);
      await ctx.reply(result.message || 'Failed to logout.');
    } catch (error) {
      await ctx.reply('Failed to logout. Please try again.');
    }
  }
} 