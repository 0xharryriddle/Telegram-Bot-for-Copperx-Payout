import { Markup, Telegraf } from 'telegraf';
import { Update } from 'telegraf/types';
import { walletMenu } from './wallet.menu';
import { transferMenu } from './transfer.menu';
import { accountMenu } from './account.menu';

/**
 * Setup all interactive menus for the bot
 * @param bot Telegraf bot instance
 */
export function setupMenus(bot: Telegraf) {
  // Main menu
  bot.action('mainMenu', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      '🌟 *Welcome to Copperx Payout Bot!* \n\nPlease select an option from the menu below to get started:',
      getMainMenu(),
    );
  });

  // Setup wallet menus
  walletMenu(bot);

  // Setup transfer menus
  transferMenu(bot);

  // Setup account menus
  accountMenu(bot);
}

/**
 * Get the main menu with all available options
 */
export function getMainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('💰 Wallet', 'wallet_menu'),
      Markup.button.callback('🔄 Transfer', 'transfer_menu'),
    ],
    [
      Markup.button.callback('👤 Account', 'account_menu'),
      Markup.button.callback('ℹ️ Help', 'help_menu'),
    ],
  ]);
}

/**
 * Get a back button for returning to the main menu
 */
export function getBackButton() {
  return Markup.inlineKeyboard([
    Markup.button.callback('« Back to Main Menu', 'mainMenu'),
  ]);
}

/**
 * Get a menu with confirm and cancel buttons
 * @param confirmAction The action for the confirm button
 * @param cancelAction The action for the cancel button
 */
export function getConfirmCancelMenu(
  confirmAction: string,
  cancelAction: string,
) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Confirm', confirmAction),
      Markup.button.callback('❌ Cancel', cancelAction),
    ],
  ]);
}

/**
 * Return a formatted message for better readability
 * @param title Title of the message
 * @param details Object containing details to display
 */
export function formatMessage(title: string, details: Record<string, any>) {
  let message = `*${title}*\n\n`;

  for (const [key, value] of Object.entries(details)) {
    if (value !== undefined && value !== null) {
      message += `*${key}:* ${value}\n`;
    }
  }

  return message;
}
