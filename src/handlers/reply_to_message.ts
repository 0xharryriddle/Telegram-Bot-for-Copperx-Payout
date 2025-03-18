import { Update } from 'telegraf/typings/core/types/typegram';
import createDebug from 'debug';
import messages from '../message';
import MyContext from '../contexts';
import { authenticate } from '../commands/authentication/authenticate';
import { AuthService } from '../../api/services/auth.service';

const debug = createDebug('bot:message_service');
const authService = new AuthService();

const reply_to_message = () => async (ctx: MyContext<Update>) => {
  debug('Processing reply to message');
  const { message } = ctx.update as any;
  const reply_to_message = message?.reply_to_message;
  const isReplyBot = reply_to_message?.from?.is_bot;
  
  if (message.reply_to_message && isReplyBot) {
    debug(`Reply detected to message: "${reply_to_message?.text}"`);
    
    // Handle login email reply
    if (reply_to_message?.text.includes(messages.login)) {
      debug('Login email reply detected');
      // Email entered, proceed to authentication
      return authenticate()(ctx);
    }
    
    // Handle authentication code reply
    if (reply_to_message?.text.includes(messages.authenticate)) {
      debug('Authentication code reply detected');
      
      const telegramUserId = ctx.from?.id;
      const messageObj = ctx.message;
      const otp = messageObj && 'text' in messageObj ? messageObj.text : null;
      
      if (!otp || !telegramUserId) {
        await ctx.reply('❌ Invalid OTP format. Please enter a valid OTP code.');
        return;
      }
      
      try {
        const response = await authService.verifyOtp(telegramUserId, otp);
        
        if (response.success) {
          await ctx.reply('✅ Authentication successful! You are now logged in.', {
            reply_markup: {
              remove_keyboard: true
            }
          });
        } else {
          await ctx.reply(`❌ Authentication failed. ${response.message}`);
        }
      } catch (error) {
        debug('OTP verification error:', error);
        await ctx.reply('❌ An error occurred during verification. Please try again later.');
      }
      
      return;
    }
  }
};

export { reply_to_message };
