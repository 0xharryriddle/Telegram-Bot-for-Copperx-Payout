import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf';
import MyContext from '../../contexts';
import { TransferService } from '../../../api/services/transfer.service';

const debug = createDebug('bot:history_command');

const transferService = new TransferService();

const history = () => async (ctx: MyContext<Update>) => {
  debug('Triggered "history" command');
  
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId) {
      return await ctx.reply('❌ Error: Could not identify user.');
    }
    
    // Show loading message
    const loadingMsg = await ctx.reply('🔄 Fetching your transaction history...');
    
    // Get transaction history (last 10 transactions)
    const result = await transferService.getTransactionHistory(telegramId, 1, 10);
    
    // Delete loading message
    if (ctx.chat) {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    }
    
    if (!result.success) {
      return await ctx.reply(`❌ ${result.message}`);
    }
    
    if (!result.history || !result.history.data || result.history.data.length === 0) {
      return await ctx.reply('You don\'t have any transactions yet.');
    }
    
    // Format transaction history
    const transactions = result.history.data;
    const historyText = transactions.map((tx: any, index: number) => {
      const date = new Date(tx.createdAt).toLocaleDateString();
      const time = new Date(tx.createdAt).toLocaleTimeString();
      const type = tx.type || 'Transfer';
      const status = tx.status || 'Completed';
      const amount = tx.amount || '0';
      const currency = tx.currency || 'USDC';
      
      return `🔹 *Transaction ${index + 1}*\n` +
             `Date: ${date} ${time}\n` +
             `Type: ${type}\n` +
             `Amount: ${amount} ${currency}\n` +
             `Status: ${status}`;
    }).join('\n\n');
    
    await ctx.reply(
      `📜 *Your Transaction History*\n\n${historyText}\n\n` +
      `Showing the last ${transactions.length} transactions.`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    debug('Error in history command:', error);
    await ctx.reply('❌ An error occurred while fetching your transaction history. Please try again later.');
  }
};

export { history }; 