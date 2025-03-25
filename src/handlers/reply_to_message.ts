import { Context } from 'telegraf';
import createDebug from 'debug';
import messages from '../utils/message';

const debug = createDebug('bot:message_service');

const reply_to_message = () => async (ctx: Context) => {
  debug('Processing reply to message');
  const { message } = ctx.update as any;
  const reply_to_message = message?.reply_to_message;
  const isReplyBot = reply_to_message?.from?.is_bot;

  if (message.reply_to_message && isReplyBot) {
    debug(`Reply detected to message: "${reply_to_message?.text}"`);

    // Handle login email reply
    if (reply_to_message?.text.includes(messages.login)) {
      debug('Login email reply detected');
      try {
        // Email entered, proceed to authentication
        const telegramUserId = ctx.from?.id;
        const messageObj = ctx.message;
        const email = messageObj && 'text' in messageObj ? messageObj.text : null;

        if (!email || !telegramUserId) {
          await ctx.reply('❌ Please enter a valid email address.');
          return;
        }

        // This would use your authentication service in a real implementation
        await ctx.reply(
          '✅ Verification code sent to your email. Please enter the OTP code:',
          {
            reply_markup: {
              force_reply: true,
            },
          }
        );
      } catch (error) {
        debug('Authentication error:', error);
        await ctx.reply(
          '❌ An error occurred during login. Please try again later.'
        );
      }
      return;
    }

    // Handle authentication code reply
    if (reply_to_message?.text.includes(messages.authenticate)) {
      debug('Authentication code reply detected');

      const telegramUserId = ctx.from?.id;
      const messageObj = ctx.message;
      const otp = messageObj && 'text' in messageObj ? messageObj.text : null;

      if (!otp || !telegramUserId) {
        await ctx.reply(
          '❌ Invalid OTP format. Please enter a valid OTP code.'
        );
        return;
      }

      try {
        // This would use your authentication service in a real implementation
        await ctx.reply(
          '✅ Authentication successful! You are now logged in.',
          {
            reply_markup: {
              remove_keyboard: true,
            },
          }
        );
      } catch (error) {
        debug('OTP verification error:', error);
        await ctx.reply(
          '❌ An error occurred during verification. Please try again later.'
        );
      }

      return;
    }
  }
};

export { reply_to_message };
