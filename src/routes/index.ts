import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import * as Commands from '../commands/index';
import createDebug from 'debug';

const debug = createDebug('bot:routes');

const index = (bot: Telegraf) => {
  // Menu
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'All commands what you need' },
    { command: 'support', description: 'Contact support' },
    { command: 'login', description: 'Login to the Copperx Payout' },
    { command: 'profile', description: 'View your profile information' },
    { command: 'kyc', description: 'Check your KYC status' },
    { command: 'wallet_menu', description: 'View your wallet menu' },
    { command: 'wallet', description: 'View your wallets' },
    { command: 'balance', description: 'Check your wallet balances' },
    { command: 'setdefault', description: 'Set your default wallet' },
    { command: 'send', description: 'Send funds to email or wallet' },
    { command: 'transfer', description: 'Transfer funds to email or wallet' },
    { command: 'history', description: 'View your transaction history' },
    { command: 'withdraw', description: 'Withdraw funds to bank account' },
    { command: 'logout', description: 'Logout from your account' },
  ]);

  // Commands
  bot.command(
    'start',
    async (ctx) => await Commands.StartCommands.getInstance().handleStart(ctx),
  );

  bot.command(
    'help',
    async (ctx) => await Commands.HelpCommands.getInstance().handleHelp(ctx),
  );

  bot.command('support', Commands.support());

  bot.command(
    'login',
    async (ctx) => await Commands.AuthCommands.getInstance().handleLogin(ctx),
  );
  bot.command(
    'logout',
    async (ctx) => await Commands.AuthCommands.getInstance().handleLogout(ctx),
  );
  bot.command(
    'profile',
    async (ctx) =>
      await Commands.AuthCommands.getInstance().handleUserProfile(ctx),
  );
  // bot.command('kyc', Commands.accessKyc());

  // Wallet Commands
  bot.command(
    'wallet_menu',
    async (ctx) =>
      await Commands.WalletCommands.getInstance().handleWalletMenu(ctx),
  );

  bot.command(
    'wallet',
    async (ctx) =>
      await Commands.WalletCommands.getInstance().handleDefaultWallet(ctx),
  );

  bot.command(
    'send',
    async (ctx) =>
      await Commands.TransferCommands.getInstance().handleSendOptions(ctx),
  );

  bot.command(
    'transfer',
    async (ctx) =>
      await Commands.TransferCommands.getInstance().handleTransferMenu(ctx),
  );

  bot.command(
    'withdraw',
    async (ctx) =>
      await Commands.TransferCommands.getInstance().handleInitiateWithdraw(ctx),
  );

  // Actions - Callbacks
  bot.action(
    'startLogin',
    async (ctx) => await Commands.AuthCommands.getInstance().handleLogin(ctx),
  );
  bot.action(
    'startHelp',
    async (ctx) => await Commands.HelpCommands.getInstance().handleHelp(ctx),
  );

  // Handle the Reply of users
  bot.on(message('text', 'reply_to_message'), async (ctx, next) => {
    return next();
  });

  // Handle text messages for transfer flows
  bot.on(message('text'), async (ctx, next) => {
    const telegramId = ctx.from?.id;

    if (telegramId) {
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
      if (
        replyText &&
        (replyText.includes('Email Verification Required') ||
          replyText.includes('provide your email address'))
      ) {
        // Store the email in the command format expected by handleInitializeLogin
        ctx.message.text = message.text;
        await Commands.AuthCommands.getInstance().handleInitializeLogin(ctx);
        return;
      }

      // If the original message was asking for OTP
      if (replyText && replyText.includes('Enter your OTP Code')) {
        await Commands.AuthCommands.getInstance().handleVerifyOtp(ctx);
        return;
      }

      if (
        replyText &&
        (replyText.includes('Input Your Wallet Network') ||
          replyText.includes(
            'Your new wallet will be securely generated and linked to your account.',
          ))
      ) {
        await Commands.WalletCommands.getInstance().handleGenerateOrGetExisting(
          ctx,
        );
      }

      if (
        replyText &&
        replyText.includes('Input Network and Token') &&
        replyText.includes('Please provide the network and token symbol')
      ) {
        await Commands.WalletCommands.getInstance().handleBalanceToken(ctx);
      }

      if (replyText && replyText.includes('Set Default Wallet')) {
        await Commands.WalletCommands.getInstance().handleSetDefaultWallet(ctx);
      }
    }
  });
};

export default index;
