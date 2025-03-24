import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import * as Commands from '../commands';
import * as Handlers from '../handlers';
import createDebug from 'debug';
import { getMainMenu } from '../menus';

const debug = createDebug('bot:routes');

const index = (bot: Telegraf) => {
  // Menu
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'All commands what you need' },
    { command: 'support', description: 'Contact support' },
    { command: 'login', description: 'Login to the Copperx Payout' },
    { command: 'otp', description: 'Verify OTP code to login' },
    {
      command: 'setpassword',
      description: 'Set password to protect your account',
    },
    { command: 'profile', description: 'View your profile information' },
    { command: 'kyc', description: 'Check your KYC status' },
    { command: 'wallet', description: 'View your wallets' },
    { command: 'balance', description: 'Check your wallet balances' },
    { command: 'setdefault', description: 'Set your default wallet' },
    { command: 'send', description: 'Send funds to email or wallet' },
    { command: 'history', description: 'View your transaction history' },
    { command: 'withdraw', description: 'Withdraw funds to bank account' },
    { command: 'logout', description: 'Logout from your account' },
  ]);

  // Commands
  bot.command(
    'start',
    async (ctx) => await Commands.StartCommands.getInstance(ctx).handleStart(),
  );

  bot.command(
    'help',
    async (ctx) => await Commands.HelpCommands.getInstance(ctx).handleHelp(),
  );

  bot.command('support', Commands.support());

  bot.command(
    'login',
    async (ctx) =>
      await Commands.AuthCommands.getInstance(ctx).handleLogin(ctx),
  );
  bot.command(
    'logout',
    async (ctx) =>
      await Commands.AuthCommands.getInstance(ctx).handleLogout(ctx),
  );

  // // OTP and Password Commands
  // bot.command('otp', Commands.verifyOtp());
  // bot.command('setpassword', Commands.setPassword());
  // bot.command('profile', Commands.accessProfile());
  // bot.command('kyc', Commands.accessKyc());

  // // Wallet Commands
  // bot.command('wallet', WalletCommands.wallet());
  // bot.command('balance', WalletCommands.balance());
  // bot.command('setdefault', WalletCommands.setDefault());

  // // Transfer Commands
  // bot.command('send', TransferCommands.send());
  // bot.command('history', TransferCommands.history());
  // bot.command('withdraw', TransferCommands.withdraw());

  // // Notification Commands
  // bot.command(
  //   'deposit_notification',
  //   NotificationCommands.depositNotification(),
  // );

  // Actions - Callbacks
  bot.action(
    'startLogin',
    async (ctx) =>
      await Commands.AuthCommands.getInstance(ctx).handleLogin(ctx),
  );
  bot.action(
    'startHelp',
    async (ctx) => await Commands.HelpCommands.getInstance(ctx).handleHelp(),
  );

  // // Send flow actions
  // bot.action('send_email', TransferCommands.handleSendEmail());
  // bot.action('send_wallet', TransferCommands.handleSendWallet());
  // bot.action('send_cancel', TransferCommands.handleSendCancel());
  // bot.action('send_confirm', TransferCommands.handleSendConfirm());

  // // Withdraw flow actions
  // bot.action('withdraw_confirm', TransferCommands.handleWithdrawConfirm());
  // bot.action('withdraw_cancel', TransferCommands.handleWithdrawCancel());

  // Handle the Reply of users
  bot.on(message('text', 'reply_to_message'), async (ctx, next) => {
    // const message = ctx.message;
    // const handler = Handlers.reply_to_message();
    // await handler(ctx);
    return next();
  });

  // Handle text messages for transfer flows
  bot.on(message('text'), async (ctx, next) => {
    const telegramId = ctx.from?.id;

    if (telegramId) {
      // Try to handle as part of send flow
      // const sendHandler = TransferCommands.handleSendMessage();
      // await sendHandler(ctx);
      // Try to handle as part of withdraw flow
      // const withdrawHandler = TransferCommands.handleWithdrawMessage();
      // await withdrawHandler(ctx);
    }

    return next();
  });

  bot.on(message('text'), async (ctx, next) => {
    // const handler = Handlers.text();
    // await handler(ctx);
    return next();
  });

  bot.on(message('sticker'), async (ctx) => {
    return ctx.reply('👍');
  });

  // Setup deposit notifications
  // NotificationCommands.setupDepositNotifications(bot);

  // Handle text messages that are replies to the bot's messages
  bot.on('text', async (ctx) => {
    const message = ctx.message;
    const replyToMessage = message.reply_to_message;

    // Check if this is a reply to the bot's login prompt
    if (replyToMessage && replyToMessage.from?.is_bot) {
      // Safely check if text property exists on the reply message
      const replyText = 'text' in replyToMessage ? replyToMessage.text : '';

      // If the original message was asking for email
      if (replyText && (
        replyText.includes('Email Verification Required') || 
        replyText.includes('provide your email address')
      )) {
        // Store the email in the command format expected by handleInitializeLogin
        ctx.message.text = message.text;
        await Commands.AuthCommands.getInstance(ctx).handleInitializeLogin(ctx);
        return;
      }

      // If the original message was asking for OTP
      if (replyText && replyText.includes('Enter your OTP Code')) {
        await Commands.AuthCommands.getInstance(ctx).handleVerifyOtp(ctx);
        return;
      }
    }
  });
};

export default index;
