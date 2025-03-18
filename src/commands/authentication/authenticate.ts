import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import messages from '../../message';
import MyContext from '../../contexts';
import { AuthService } from '../../../api/services/auth.service';

const debug = createDebug('bot:login_command');

const authService = new AuthService();

const login = () => async (ctx: MyContext<Update>) => {
  const messageText = messages.login;

  debug(`Triggered "login" command with message \n${messageText}`);

  const sentMessage = await ctx.sendMessage(messageText, {
    parse_mode: 'Markdown',
    reply_markup: {
      force_reply: true, // This forces the user to reply to this message
      selective: true, // This makes sure that only the user who clicked the button can interact with the bot
    },
    entities: [
      {
        type: 'text_link',
        offset: 0,
        length: 4,
        url: 'https://google.com',
      },
    ],
  });
};

const authenticate = () => async (ctx: MyContext<Update>) => {
  debug('Processing authentication request');
  
  const telegramUser = ctx.from;
  const telegramUserId = telegramUser?.id;
  const messageObj = ctx.message;
  const email = messageObj && 'text' in messageObj ? messageObj.text : null;
  
  if (!email || !telegramUserId) {
    await ctx.reply('❌ Invalid email format. Please try again with a valid email address.');
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    await ctx.reply('❌ Please enter a valid email address.');
    return;
  }
  
  debug(`Authenticating user ${telegramUserId} with email ${email}`);
  
  // Show typing indicator
  await ctx.sendChatAction('typing');
  
  try {
    // Attempt to authenticate with the provided email
    const response = await authService.emailOtpRequest(email, telegramUserId);
    
    if (response && response.success) {
      const messageText = messages.authenticate;
      debug(`Authentication request sent, waiting for OTP: \n${messageText}`);
  
      const sentMessage = await ctx.sendMessage(messageText, {
        parse_mode: 'Markdown',
        reply_markup: {
          force_reply: true, // This forces the user to reply to this message
          selective: true, // This makes sure that only the user who clicked the button can interact with the bot
        },
      });
    } else {
      const errorMessage = response?.message || 'The authentication service is currently unavailable. Please try again later.';
      await ctx.reply(`❌ ${errorMessage}`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔄 Try Again', callback_data: 'startLogin' }]
          ]
        }
      });
    }
  } catch (error) {
    debug('Authentication error:', error);
    await ctx.reply('❌ The authentication service is currently experiencing issues. Please try again in a few minutes.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔄 Try Again', callback_data: 'startLogin' }]
        ]
      }
    });
  }
};

export { login, authenticate };
