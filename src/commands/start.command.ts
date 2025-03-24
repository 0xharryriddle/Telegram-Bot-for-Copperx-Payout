import { AuthService } from '../api/services/auth.service';
import { SessionService } from '../api/services/session.service';
import { Context, Markup } from 'telegraf';
import { Update } from 'telegraf/types';
import createDebug from 'debug';
import { getMainMenu } from '../menus';

const debug = createDebug('bot:start_command');

export class StartCommands {
  private static instance: StartCommands;
  private authService: AuthService;
  private sessionService: SessionService;
  private context: Context;

  private constructor(context: Context<Update>) {
    this.context = context;
    this.authService = AuthService.getInstance(context);
    this.sessionService = SessionService.getInstance();
  }

  static getInstance(context: Context<Update>) {
    if (!this.instance) {
      this.instance = new StartCommands(context);
    }
    return this.instance;
  }

  async handleStart() {
    try {
      const chatId = this.context.chat?.id;
      if (!chatId) {
        await this.context.reply('Could not identify user.');
        return;
      }

      const isAuthenticated = await this.authService.isAuthenticated(chatId);

      console.log(isAuthenticated);

      if (!isAuthenticated) {
        const messageText = `👋 *Welcome to Copperx Payout Bot!*

This bot allows you to manage your Copperx Payout account directly from Telegram.

*What you can do:*
• Deposit and withdraw USDC
• Send funds to email addresses or wallet addresses
• View your transaction history
• Manage your wallets
• Receive deposit notifications

To get started, please login to your Copperx Payout account.`;

        debug(`Triggered "start" command with message \n${messageText}`);

        await this.context.reply(messageText, {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('🔐 Login', 'startLogin')],
            [Markup.button.callback('❓ Help', 'startHelp')],
          ]),
        });
        return;
      } else {
        await this.context.reply(
          '🌟 *Welcome to Copperx Payout Bot!* \n\nPlease select an option from the menu below to get started:',
          {
            reply_markup: {
              inline_keyboard: getMainMenu().reply_markup.inline_keyboard,
            },
            parse_mode: 'Markdown',
          },
        );
      }
    } catch (error) {}
  }
}
