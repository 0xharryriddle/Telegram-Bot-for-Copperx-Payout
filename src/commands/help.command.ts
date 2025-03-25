import createDebug from 'debug';
import { Context } from 'telegraf';
import { Update } from 'telegraf/types';

const debug = createDebug('bot:help_command');

export class HelpCommands {
  private static instance: HelpCommands;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new HelpCommands();
    }
    return this.instance;
  }

  async handleHelp(context: Context<Update>) {
    const messageText = `🤖 *Copperx Payout Bot Help*

*Authentication Commands*
/login - Login to your Copperx Payout account
/logout - Logout from your account

*Wallet Commands*
/wallet - View your wallets
/balance - Check your wallet balances
/setdefault - Set your default wallet

*Transfer Commands*
/send - Send funds to email or wallet address
/history - View your transaction history
/withdraw - Withdraw funds to your bank account

*General Commands*
/start - Start the bot
/help - Show this help message
/support - Contact support

Need more help? Visit our website at https://copperx.io or contact our support team.`;

    debug('Help command triggered');

    await context.sendMessage(messageText, { parse_mode: 'Markdown' });
  }
}
