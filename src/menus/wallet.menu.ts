import { Markup, Telegraf } from 'telegraf';
import { getBackButton } from './index';

/**
 * Setup wallet related menus
 * @param bot Telegraf bot instance
 */
export function walletMenu(bot: Telegraf) {
  // Main wallet menu
  bot.action('wallet_menu', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      '💰 *Wallet Menu*\n\nWhat would you like to do?',
      getWalletMenu(),
    );
  });

  // Handle each wallet action
  bot.action('wallet_list', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Fetching your wallets...');
    // Call command handler for wallets list
    // const walletHandler = WalletCommands.wallet();
    // await walletHandler(ctx);
  });

  bot.action('wallet_balance', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Checking your balance...');
    // Call command handler for balance
    // const balanceHandler = WalletCommands.balance();
    // await balanceHandler(ctx);
  });

  bot.action('wallet_setdefault', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Select default wallet...');
    // Call command handler for setting default wallet
    // const setDefaultHandler = WalletCommands.setDefault();
    // await setDefaultHandler(ctx);
  });

  // Handle set default wallet options
  bot.action(/set_default_wallet:(.+)/, async (ctx) => {
    const walletId = ctx.match[1];
    await ctx.answerCbQuery();
    await ctx.reply(`Setting wallet ${walletId} as default...`);

    try {
      // Call the standard setDefault handler with the walletId
      // const setDefaultHandler = WalletCommands.setDefault();
      // await setDefaultHandler(ctx);
      await ctx.reply(
        `Wallet ${walletId} has been set as your default wallet.`,
      );
    } catch (error) {
      console.error('Error setting default wallet:', error);
      await ctx.reply('Cannot set default wallet. Please try again later.');
    }
  });
}

/**
 * Get the wallet menu with available options
 */
export function getWalletMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('📋 My Wallets', 'wallet_list'),
      Markup.button.callback('💸 My Balance', 'wallet_balance'),
    ],
    [
      Markup.button.callback('⭐ Set Default Wallet', 'wallet_setdefault'),
      Markup.button.callback('« Back', 'mainMenu'),
    ],
  ]);
}

/**
 * Generate a menu for wallet selection
 * @param wallets Array of wallet objects with id and name properties
 * @param actionPrefix Prefix for the callback action
 */
export function getWalletSelectionMenu(
  wallets: Array<{ id: string; name: string }>,
  actionPrefix: string,
) {
  const buttons = wallets.map((wallet) => [
    Markup.button.callback(wallet.name, `${actionPrefix}:${wallet.id}`),
  ]);

  buttons.push([Markup.button.callback('« Back', 'wallet_menu')]);

  return Markup.inlineKeyboard(buttons);
}
