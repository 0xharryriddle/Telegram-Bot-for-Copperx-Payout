import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import MyContext from '../../contexts';
import { WalletService } from '../../../api/services/wallet.service';

const debug = createDebug('bot:balance_command');

const walletService = new WalletService();

const balance = () => async (ctx: MyContext<Update>) => {
  debug('Triggered "balance" command');
  
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId) {
      return await ctx.reply('❌ Error: Could not identify user.');
    }
    
    // Show loading message
    const loadingMsg = await ctx.reply('🔄 Fetching your wallet balances...');
    
    // Get wallet balances
    const result = await walletService.getWalletBalances(telegramId);
    
    // Delete loading message
    if (ctx.chat) {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    }
    
    if (!result.success) {
      return await ctx.reply(`❌ ${result.message}`);
    }
    
    if (!result.balances || result.balances.length === 0) {
      return await ctx.reply('You don\'t have any balances yet.');
    }
    
    // Format balance information
    const balanceText = result.balances.map((balance: any) => {
      return `💰 *${balance.currency}*: ${balance.amount} on ${balance.network}`;
    }).join('\n');
    
    await ctx.reply(
      `💼 *Your Wallet Balances*\n\n${balanceText}\n\n` +
      `Use /wallet to view your wallets.\n` +
      `Use /send to transfer funds.`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    debug('Error in balance command:', error);
    await ctx.reply('❌ An error occurred while fetching your balances. Please try again later.');
  }
};

export { balance }; 