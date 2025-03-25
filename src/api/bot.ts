// import { Telegraf, session } from 'telegraf';
// import * as Configs from '../configs';
// import { validateOtp } from './utils/validation';

// export class Bot {
//   private bot: Telegraf;
//   private emailCommands: EmailCommands;
//   private walletCommands: WalletCommands;
//   private transferCommands: TransferCommands;

//   constructor() {
//     this.bot = new Telegraf(Configs.ENV.BOT_TOKEN);
//     this.emailCommands = new EmailCommands();
//     this.walletCommands = new WalletCommands();
//     this.transferCommands = new TransferCommands();

//     this.setupMiddleware();
//     this.setupCommands();
//   }

//   private setupMiddleware() {
//     // Use session middleware
//     this.bot.use(session());

//     // Log all interactions
//     this.bot.use(async (ctx, next) => {
//       const telegramId = ctx.from?.id;
//       const username = ctx.from?.username;
//       const text = (ctx.message as any)?.text;

//       if (telegramId) {
//         Configs.logger.info('Bot interaction', {
//           telegramId,
//           username,
//           text: text?.slice(0, 100), // Truncate long messages
//         });
//       }

//       return next();
//     });
//   }

//   private setupCommands() {
//     // Email management commands
//     this.bot.command(
//       'login',
//       this.emailCommands.loginWithEmail.bind(this.emailCommands),
//     );
//     this.bot.command(
//       'emails',
//       this.emailCommands.listEmails.bind(this.emailCommands),
//     );
//     // this.bot.command('setdefault', this.emailCommands.setDefaultEmail.bind(this.emailCommands));
//     this.bot.command(
//       'logout',
//       this.emailCommands.logoutEmail.bind(this.emailCommands),
//     );
//     this.bot.command(
//       'logoutall',
//       this.emailCommands.logoutAll.bind(this.emailCommands),
//     );

//     // OTP verification
//     this.bot.command('verifyotp', async (ctx) => {
//       try {
//         const message = ctx.message as any;
//         const telegramId = ctx.from?.id;

//         if (!telegramId) {
//           await ctx.reply('Could not identify user.');
//           return;
//         }

//         const args = message.text.split(' ');
//         const otp = args[1];

//         if (!otp) {
//           await ctx.reply('Please provide the OTP.\nUsage: /verifyotp <otp>');
//           return;
//         }

//         if (!validateOtp(otp)) {
//           await ctx.reply('Invalid OTP format. Please provide a 6-digit OTP.');
//           return;
//         }

//         const result = await this.emailCommands.authService.verifyOtp(
//           telegramId,
//           otp,
//         );
//         await ctx.reply(result.message || 'OTP verification failed.');
//       } catch (error) {
//         Configs.logger.error('Error in verifyOtp command', error);
//         await ctx.reply(
//           'An error occurred while verifying OTP. Please try again.',
//         );
//       }
//     });

//     // Wallet commands
//     this.bot.command(
//       'balance',
//       this.walletCommands.getBalance.bind(this.walletCommands),
//     );
//     this.bot.command(
//       'wallets',
//       this.walletCommands.listWallets.bind(this.walletCommands),
//     );
//     this.bot.command(
//       'setdefaultwallet',
//       this.walletCommands.setDefaultWallet.bind(this.walletCommands),
//     );

//     // Transfer commands
//     this.bot.command(
//       'send',
//       this.transferCommands.sendFunds.bind(this.transferCommands),
//     );

//     // Help command
//     this.bot.command('help', async (ctx) => {
//       await ctx.reply(
//         '📋 Available commands:\n\n' +
//           '*Email Management*\n' +
//           '/login <email> - Login with email\n' +
//           '/verifyotp <otp> - Verify OTP sent to your email\n' +
//           '/emails - List your registered emails\n' +
//           '/setdefault <email> - Set default email\n' +
//           '/logout <email> - Logout specific email\n' +
//           '/logoutall - Logout from all emails\n\n' +
//           '*Wallet Management*\n' +
//           '/balance - Check your balance\n' +
//           '/wallets - List your wallets\n' +
//           '/setdefaultwallet <walletId> - Set default wallet\n\n' +
//           '*Transfers*\n' +
//           '/send <email> <amount> <currency> - Send funds to email\n\n' +
//           '*General*\n' +
//           '/help - Show this help message',
//         { parse_mode: 'Markdown' },
//       );
//     });

//     // Start command
//     this.bot.start(async (ctx) => {
//       const firstName = ctx.from.first_name || 'there';
//       await ctx.reply(
//         `👋 Hello ${firstName}!\n\n` +
//           'Welcome to CopperX Payout Bot. This bot allows you to manage multiple CopperX accounts and perform various operations.\n\n' +
//           'To get started, use /login <email> to add your first email account.\n' +
//           'Use /help to see all available commands.',
//         { parse_mode: 'Markdown' },
//       );
//     });

//     // Handle unknown commands
//     this.bot.on('text', async (ctx) => {
//       const message = ctx.message.text;
//       if (message.startsWith('/')) {
//         await ctx.reply(
//           'Unknown command. Use /help to see available commands.',
//         );
//       }
//     });
//   }

//   async launch() {
//     try {
//       await this.bot.launch();
//       Configs.logger.info('Bot started successfully');

//       // Enable graceful stop
//       process.once('SIGINT', () => this.bot.stop('SIGINT'));
//       process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

//       return true;
//     } catch (error) {
//       Configs.logger.error('Failed to start bot', error);
//       return false;
//     }
//   }
// }
