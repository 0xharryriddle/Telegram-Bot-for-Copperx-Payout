import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import MyContext from '../../contexts';
import { WalletService } from '../../../api/services/wallet.service';

const debug = createDebug('bot:setdefault_command');

const walletService = new WalletService();

const setDefault = () => async (ctx: MyContext<Update>) => {
  debug('Triggered "setdefault" command');
  
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId) {
      return await ctx.reply('❌ Error: Could not identify user.');
    }
    
    // Get the wallet ID from the command arguments
    const message = ctx.message as any;
    const args = message.text.split(' ').slice(1);
    
    if (args.length === 0) {
      return await ctx.reply(
        '❌ Please provide a wallet ID.\n\n' +
        'Usage: /setdefault <wallet_id>\n\n' +
        'Use /wallet to view your wallets and their IDs.'
      );
    }
    
    const walletId = args[0];
    
    // Show loading message
    const loadingMsg = await ctx.reply('🔄 Setting default wallet...');
    
    // Set default wallet
    const result = await walletService.setDefaultWallet(telegramId, walletId);
    
    // Delete loading message
    if (ctx.chat) {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    }
    
    if (!result.success) {
      return await ctx.reply(`❌ ${result.message}`);
    }
    
    await ctx.reply(
      '✅ Default wallet set successfully!\n\n' +
      'Use /wallet to view your wallets.'
    );
  } catch (error) {
    debug('Error in setdefault command:', error);
    await ctx.reply('❌ An error occurred while setting your default wallet. Please try again later.');
  }
};

export { setDefault }; 