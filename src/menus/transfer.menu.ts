import { Markup, Telegraf } from 'telegraf';

/**
 * Setup transfer related menus
 * @param bot Telegraf bot instance
 */
export function transferMenu(bot: Telegraf) {
  // Main transfer menu
  bot.action('transfer_menu', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('🔄 *Transfer Menu*\n\nWhat would you like to do?', {
      parse_mode: 'Markdown',
      ...getTransferMenu(),
    });
  });

  // Handle each transfer action
  bot.action('transfer_send', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      '📤 *Send funds*\n\nWhere would you like to send funds?',
      getSendOptions(),
    );
  });

  bot.action('transfer_history', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Fetching your transaction history...');
    // Call command handler for transaction history
    // const historyHandler = TransferCommands.history();
    // await historyHandler(ctx);
  });

  bot.action('transfer_withdraw', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Starting withdrawal...');
    // Call command handler for withdrawal
    // const withdrawHandler = TransferCommands.withdraw();
    // await withdrawHandler(ctx);
  });

  // Handle sending options
  bot.action('send_email', async (ctx) => {
    await ctx.answerCbQuery();
    // const handler = TransferCommands.handleSendEmail();
    // await handler(ctx);
  });

  bot.action('send_wallet', async (ctx) => {
    await ctx.answerCbQuery();
    // const handler = TransferCommands.handleSendWallet();
    // await handler(ctx);
  });

  // Handle cancel
  bot.action('send_cancel', async (ctx) => {
    await ctx.answerCbQuery();
    // const handler = TransferCommands.handleSendCancel();
    // await handler(ctx);
  });

  // Handle confirmation
  bot.action('send_confirm', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Processing your transfer...');
    // const handler = TransferCommands.handleSendConfirm();
    // await handler(ctx);
  });

  // Withdraw actions
  bot.action('withdraw_confirm', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('Processing your withdrawal...');
    // const handler = TransferCommands.handleWithdrawConfirm();
    // await handler(ctx);
  });

  bot.action('withdraw_cancel', async (ctx) => {
    await ctx.answerCbQuery();
    // const handler = TransferCommands.handleWithdrawCancel();
    // await handler(ctx);
  });
}

/**
 * Get the transfer menu with available options
 */
export function getTransferMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('📤 Send', 'transfer_send'),
      Markup.button.callback('📜 History', 'transfer_history'),
    ],
    [
      Markup.button.callback('🏦 Withdraw', 'transfer_withdraw'),
      Markup.button.callback('« Back', 'mainMenu'),
    ],
  ]);
}

/**
 * Get the send funds options menu
 */
export function getSendOptions() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('📧 Send to Email', 'send_email'),
      Markup.button.callback('👛 Send to Wallet', 'send_wallet'),
    ],
    [Markup.button.callback('« Back', 'transfer_menu')],
  ]);
}

/**
 * Get the confirm/cancel menu for transfers
 */
export function getTransferConfirmMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Confirm Transfer', 'send_confirm'),
      Markup.button.callback('❌ Cancel', 'send_cancel'),
    ],
  ]);
}

/**
 * Get the confirm/cancel menu for withdrawals
 */
export function getWithdrawConfirmMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Confirm Withdrawal', 'withdraw_confirm'),
      Markup.button.callback('❌ Cancel', 'withdraw_cancel'),
    ],
  ]);
}
