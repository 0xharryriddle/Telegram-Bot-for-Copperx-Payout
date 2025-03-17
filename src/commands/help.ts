import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import MyContext from '../contexts';

const debug = createDebug('bot:help_command');

const help = () => async (ctx: MyContext<Update>) => {
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

  debug(`Triggered "help" command with message \n${messageText}`);

  await ctx.reply(messageText, { parse_mode: 'Markdown' });
};

export { help };
