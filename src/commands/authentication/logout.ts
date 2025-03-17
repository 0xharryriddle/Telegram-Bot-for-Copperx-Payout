import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import MyContext from '../../contexts';
import { AuthService } from '../../../api/services/auth.service';

const debug = createDebug('bot:logout_command');

const authService = new AuthService();

const logout = () => async (ctx: MyContext<Update>) => {
  debug('Triggered "logout" command');
  
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId) {
      return await ctx.reply('❌ Error: Could not identify user.');
    }
    
    // Show loading message
    const loadingMsg = await ctx.reply('🔄 Logging out...');
    
    // Logout
    const result = await authService.logout(telegramId);
    
    // Delete loading message
    if (ctx.chat) {
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
    }
    
    if (!result.success) {
      return await ctx.reply(`❌ ${result.message}`);
    }
    
    await ctx.reply(
      '✅ *Logged out successfully*\n\n' +
      'You have been logged out of your Copperx Payout account.\n\n' +
      'Use /login to log back in.',
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    debug('Error in logout command:', error);
    await ctx.reply('❌ An error occurred while logging out. Please try again later.');
  }
};

export { logout }; 