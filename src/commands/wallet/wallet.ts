import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import MyContext from '../../contexts';
import { WalletService } from '../../../api/services/wallet.service';

const debug = createDebug('bot:wallet_command');

const walletService = new WalletService();

const wallet = () => async (ctx: MyContext<Update>) => {
  debug('Triggered "wallet" command');
  
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId) {
      return await ctx.reply('❌ Error: Could not identify user.');
    }
    
    // Show loading message
    const loadingMsg = await ctx.reply('🔄 Fetching your wallets...');
    
    // Get wallets
    const result = await walletService.getWallets(telegramId);
    
    // Delete loading message
    if (ctx.chat) {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    }
    
    if (!result.success) {
      return await ctx.reply(`❌ ${result.message}`);
    }
    
    if (!result.wallets || result.wallets.length === 0) {
      return await ctx.reply('You don\'t have any wallets yet.');
    }
    
    // Format wallet information
    const walletText = result.wallets.map((wallet: any, index: number) => {
      return `🔹 *Wallet ${index + 1}*\n` +
             `ID: \`${wallet.id}\`\n` +
             `Network: ${wallet.network}\n` +
             `Address: \`${wallet.address}\`\n` +
             (wallet.isDefault ? '✅ *Default Wallet*' : '');
    }).join('\n\n');
    
    await ctx.reply(
      `💼 *Your Wallets*\n\n${walletText}\n\n` +
      `Use /balance to check your wallet balances.\n` +
      `Use /setdefault <wallet_id> to set a default wallet.`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    debug('Error in wallet command:', error);
    await ctx.reply('❌ An error occurred while fetching your wallets. Please try again later.');
  }
};

export { wallet }; 