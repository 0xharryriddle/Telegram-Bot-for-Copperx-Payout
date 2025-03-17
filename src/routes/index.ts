import { Context, Markup, session, Telegraf } from 'telegraf';
import { message, callbackQuery, channelPost } from 'telegraf/filters';
import { Update, Message } from 'telegraf/typings/core/types/typegram';
import * as Commands from '../commands';
import * as Handlers from '../handlers';
import MyContext from '../contexts';
import createDebug from 'debug';
import * as WalletCommands from '../commands/wallet';
import * as TransferCommands from '../commands/transfer';
import * as NotificationCommands from '../commands/notification';

const debug = createDebug('bot:routes');

const index = (bot: Telegraf<MyContext<Update>>) => {
  bot.use(session());
  // Menu
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'All commands what you need' },
    { command: 'support', description: 'Contact support' },
    { command: 'login', description: 'Login to the Copperx Payout' },
    { command: 'wallet', description: 'View your wallets' },
    { command: 'balance', description: 'Check your wallet balances' },
    { command: 'setdefault', description: 'Set your default wallet' },
    { command: 'send', description: 'Send funds to email or wallet' },
    { command: 'history', description: 'View your transaction history' },
    { command: 'withdraw', description: 'Withdraw funds to bank account' },
  ]);

  // Commands
  bot.command('start', Commands.start());
  bot.command('help', Commands.help());
  bot.command('support', Commands.support());
  bot.command('login', Commands.login());
  bot.command('logout', Commands.logout());
  
  // Wallet Commands
  bot.command('wallet', WalletCommands.wallet());
  bot.command('balance', WalletCommands.balance());
  bot.command('setdefault', WalletCommands.setDefault());
  
  // Transfer Commands
  bot.command('send', TransferCommands.send());
  bot.command('history', TransferCommands.history());
  bot.command('withdraw', TransferCommands.withdraw());

  // Notification Commands
  bot.command('deposit_notification', NotificationCommands.depositNotification());

  // Actions - Callbacks
  bot.action('startLogin', Commands.login());
  bot.action('startHelp', Commands.handleStartHelp());
  
  // Send flow actions
  bot.action('send_email', TransferCommands.handleSendEmail());
  bot.action('send_wallet', TransferCommands.handleSendWallet());
  bot.action('send_cancel', TransferCommands.handleSendCancel());
  bot.action('send_confirm', TransferCommands.handleSendConfirm());
  
  // Withdraw flow actions
  bot.action('withdraw_confirm', TransferCommands.handleWithdrawConfirm());
  bot.action('withdraw_cancel', TransferCommands.handleWithdrawCancel());

  // Handle the Reply of users
  bot.on(message('text', 'reply_to_message'), Handlers.reply_to_message());

  // Handle text messages for transfer flows
  bot.on(message('text'), async (ctx, next) => {
    const telegramId = ctx.from?.id;
    
    if (telegramId) {
      // Try to handle as part of send flow
      await TransferCommands.handleSendMessage()(ctx);
      
      // Try to handle as part of withdraw flow
      await TransferCommands.handleWithdrawMessage()(ctx);
    }
    
    return next();
  });
  
  bot.on(message('text'), Handlers.text());
  bot.on(message('sticker'), (ctx: MyContext<Update>) => ctx.reply('👍'));
  
  // Setup deposit notifications
  NotificationCommands.setupDepositNotifications(bot);
};

export default index;
