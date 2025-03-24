// import { Telegraf } from 'telegraf';
// import { AuthCommands } from '../commands/auth.command';
// import { EmailCommands } from '../commands/email.command';
// import { WalletCommands } from '../commands/wallet.command';
// import { KYCCommands } from '../commands/kyc.command';
// import { BotContext } from '../api/types/bot.type';
// import * as Configs from '../configs';

// export class Bot {
//   private bot: Telegraf<BotContext>;
//   private authCommands: AuthCommands;
//   private emailCommands: EmailCommands;
//   private walletCommands: WalletCommands;
//   private kycCommands: KYCCommands;

//   constructor() {
//     this.bot = new Telegraf<BotContext>(Configs.ENV.BOT_TOKEN);
//     this.authCommands = new AuthCommands();
//     this.emailCommands = new EmailCommands();
//     this.walletCommands = new WalletCommands();
//     this.kycCommands = new KYCCommands();
//     this.setupCommands();
//   }

//   private setupCommands() {
//     // Start command
//     this.bot.command('start', (ctx) => {
//       ctx.reply(
//         'Welcome to CopperX Payout Bot! 👋\n\n' +
//           'Available commands:\n' +
//           '/login <email> - Login with email\n' +
//           '/otp <code> - Verify OTP code\n' +
//           '/emails - List your registered emails\n' +
//           '/setdefault <email> - Set default email\n' +
//           '/logout <email> - Logout specific email\n' +
//           '/logoutall - Logout from all emails\n' +
//           '/wallet - View wallet information\n' +
//           '/kyc - Check KYC status',
//       );
//     });

//     // Auth commands
//     this.bot.command(
//       'otp',
//       this.authCommands.verifyOtp.bind(this.authCommands),
//     );

//     // Email management commands
//     this.bot.command(
//       'login',
//       this.emailCommands.loginWithEmail.bind(this.emailCommands),
//     );
//     this.bot.command(
//       'emails',
//       this.emailCommands.listEmails.bind(this.emailCommands),
//     );
//     // this.bot.command(
//     //   'setdefault',
//     //   this.emailCommands.setDefaultEmail.bind(this.emailCommands),
//     // );
//     this.bot.command(
//       'logout',
//       this.emailCommands.logoutEmail.bind(this.emailCommands),
//     );
//     this.bot.command(
//       'logoutall',
//       this.emailCommands.logoutAll.bind(this.emailCommands),
//     );

//     // Wallet commands
//     this.bot.command(
//       'wallet',
//       this.walletCommands.getWalletInfo.bind(this.walletCommands),
//     );

//     // KYC commands
//     this.bot.command(
//       'kyc',
//       this.kycCommands.getKYCStatus.bind(this.kycCommands),
//     );
//   }

//   public start() {
//     this.bot.launch();
//     Configs.logger.info('Bot started successfully');

//     // Enable graceful stop
//     process.once('SIGINT', () => this.bot.stop('SIGINT'));
//     process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
//   }
// }
