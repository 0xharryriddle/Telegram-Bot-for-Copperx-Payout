import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf';
import MyContext from '../contexts';

const debug = createDebug('bot:start_command');

const start = () => async (ctx: MyContext<Update>) => {
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

  await ctx.reply(messageText, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      [Markup.button.callback('🔐 Login', 'startLogin')],
      [Markup.button.callback('❓ Help', 'startHelp')]
    ])
  });
};

const handleStartHelp = () => async (ctx: MyContext<Update>) => {
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

  await ctx.editMessageText(messageText, { parse_mode: 'Markdown' });
};

export { start, handleStartHelp };
