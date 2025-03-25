import { Markup, Telegraf } from 'telegraf';
import { getBackButton } from './index';

/**
 * Setup account related menus
 * @param bot Telegraf bot instance
 */
export function accountMenu(bot: Telegraf) {
  // Main account menu
  bot.action('account_menu', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      '👤 *Account Menu*\n\nManage your account:',
      getAccountMenu(),
    );
  });

  // Handle each account action
  bot.action('account_login', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Starting login process...');
    // Call command handler for login
    // const loginHandler = Commands.login();
    // await loginHandler(ctx);
  });

  bot.action('account_profile', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Fetching your profile...');
    // Call command handler for profile
    // const profileHandler = Commands.accessProfile();
    // await profileHandler(ctx);
  });

  bot.action('account_kyc', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Checking your KYC status...');
    // Call command handler for KYC status
    // const kycHandler = Commands.accessKyc();
    // await kycHandler(ctx);
  });

  bot.action('account_logout', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Logging out...');
    // Call command handler for logout
    // const logoutHandler = Commands.logout();
    // await logoutHandler(ctx);
  });

  // Help menu
  bot.action('help_menu', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Loading help...');
    // Call command handler for help
    // const helpHandler = Commands.help();
    // await helpHandler(ctx);
  });
}

/**
 * Get the account menu with available options
 */
export function getAccountMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🔑 Login', 'account_login'),
      Markup.button.callback('👤 Profile', 'account_profile'),
    ],
    [
      Markup.button.callback('🆔 KYC Status', 'account_kyc'),
      Markup.button.callback('🚪 Logout', 'account_logout'),
    ],
    [Markup.button.callback('« Back', 'mainMenu')],
  ]);
}

/**
 * Get login menu with OTP option
 */
export function getLoginMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('Enter OTP Code', 'login_enter_otp')],
    [Markup.button.callback('« Back', 'account_menu')],
  ]);
}
