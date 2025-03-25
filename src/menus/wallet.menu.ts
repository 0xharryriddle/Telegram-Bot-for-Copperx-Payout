import { Markup, Telegraf } from 'telegraf';
import { getBackButton, getMainMenu } from './index';
import { WalletCommands } from '../commands/index';

/**
 * Setup wallet related menus
 * @param bot Telegraf bot instance
 */
export function walletMenu(bot: Telegraf) {
  // Main wallet menu
  bot.action('wallet_menu', async (ctx) => {
    // await ctx.answerCbQuery();
    await ctx.reply('💰 *Wallet Menu*\n\nWhat would you like to do?', {
      parse_mode: 'Markdown',
      ...getWalletMenu(),
    });
  });

  // Back to wallet menu
  bot.action('back_wallet_menu', async (ctx) => {
    await ctx.editMessageText(
      '💰 *Wallet Menu*\n\nWhat would you like to do?',
      {
        parse_mode: 'Markdown',
        ...getWalletMenu(),
      },
    );
  });

  // Handle each wallet action
  bot.action('wallet_list', async (ctx) => {
    await ctx.answerCbQuery();
    // Call command handler for wallets list
    await WalletCommands.getInstance().handleWalletInfo(ctx);
  });

  bot.action('wallet_get_or_generate_wallet', async (ctx) => {
    await ctx.answerCbQuery();
    // Call command handler for generating a new wallet
    const generateWalletHandler = WalletCommands.getInstance();
    await generateWalletHandler.handleIntializeGeneratingWallet(ctx);
  });

  bot.action('wallet_token_balance', async (ctx) => {
    await ctx.answerCbQuery();
    // Call command handler for balance
    console.log('Hello');
    const balanceHandler = WalletCommands.getInstance();
    await balanceHandler.handleInitializeBalanceToken(ctx);
  });

  bot.action('wallet_balances', async (ctx) => {
    await ctx.answerCbQuery();
    // Call command handler for balance
    const balanceHandler = WalletCommands.getInstance();
    await balanceHandler.handleBalances(ctx);
  });

  bot.action('wallet_default', async (ctx) => {
    await ctx.answerCbQuery();
    const defaultWalletHandler = WalletCommands.getInstance();
    await defaultWalletHandler.handleInitializeSetDefaultWallet(ctx);
  });

  bot.action('wallet_setdefault', async (ctx) => {
    await ctx.answerCbQuery();
    // Call command handler for setting default wallet
    const setDefaultHandler = WalletCommands.getInstance();
    await setDefaultHandler.handleInitializeSetDefaultWallet(ctx);
  });

  bot.action('back_main_menu', async (ctx) => {
    await ctx.editMessageText(
      '🌟 *Welcome to Copperx Payout Bot!* \n\nPlease select an option from the menu below to get started:',
      {
        parse_mode: 'Markdown',
        ...getMainMenu(),
      },
    );
  });

  bot.action('refresh_wallet_info_menu', async (ctx) => {
    await ctx.answerCbQuery();
    await WalletCommands.getInstance().handleWalletInfo(ctx);
  });

  bot.action('wallet_transaction_history', async (ctx) => {
    await ctx.answerCbQuery();
    await WalletCommands.getInstance().handleTransactionHistory(ctx);
  });

  // Handle set default wallet options
  // bot.action(/set_default_wallet:(.+)/, async (ctx) => {
  //   const walletId = ctx.match[1];
  //   await ctx.answerCbQuery();
  //   await ctx.reply(`Setting wallet ${walletId} as default...`);

  //   try {
  //     // Call the standard setDefault handler with the walletId
  //     // const setDefaultHandler = WalletCommands.setDefault();
  //     // await setDefaultHandler(ctx);
  //     await ctx.reply(
  //       `Wallet ${walletId} has been set as your default wallet.`,
  //     );
  //   } catch (error) {
  //     console.error('Error setting default wallet:', error);
  //     await ctx.reply('Cannot set default wallet. Please try again later.');
  //   }
  // });
}

/**
 * Get the wallet menu with available options
 */
export function getWalletMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('📋 My Wallets', 'wallet_list'),
      Markup.button.callback(
        '👛 Generate Wallet',
        'wallet_get_or_generate_wallet',
      ),
    ],
    [
      Markup.button.callback('💸 My Balances', 'wallet_balances'),
      Markup.button.callback('🪙 Balance Token', 'wallet_token_balance'),
    ],
    [
      Markup.button.callback('🔑 Get Default Wallet', 'wallet_default'),
      Markup.button.callback('⭐ Set Default Wallet', 'wallet_setdefault'),
    ],
    [
      Markup.button.callback(
        '📜 Transaction History',
        'wallet_transaction_history',
      ),
    ],
    [Markup.button.callback('« Back', 'back_main_menu')],
  ]);
}

/**
 * Get the token balance menu with network and token input options
 */
export function getTokenBalanceMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('Select Network', 'select_network_balance'),
      Markup.button.callback('Enter Token Symbol', 'enter_token_symbol'),
    ],
    [Markup.button.callback('Check Balance', 'check_token_balance')],
    [Markup.button.callback('« Back', 'back_wallet_menu')],
  ]);
}

/**
 * Get the network selection menu for token balance
 * @param networks Array of available networks
 */
export function getNetworkSelectionMenu(
  networks: Array<{ id: string; name: string }>,
) {
  const buttons = networks.map((network) => [
    Markup.button.callback(network.name, `select_network:${network.id}`),
  ]);

  buttons.push([Markup.button.callback('« Back', 'token_balance_menu')]);

  return Markup.inlineKeyboard(buttons);
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

  buttons.push([Markup.button.callback('« Back', 'back_wallet_menu')]);

  return Markup.inlineKeyboard(buttons);
}

export function getWalletInfoMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🔃 Refresh', 'refresh_wallet_info_menu')],
    [Markup.button.callback('« Back', 'back_wallet_menu')],
  ]);
}
