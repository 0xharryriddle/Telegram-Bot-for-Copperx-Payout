import { Update } from 'telegraf/typings/core/types/typegram';
import createDebug from 'debug';
import messages from '../message';
import MyContext from '../contexts';

const debug = createDebug('bot:message_service');

const reply_to_message = () => async (ctx: MyContext<Update>) => {
  debug('Message service');
  console.log(ctx.update);
  const { message } = ctx.update as any;
  const reply_to_message = message?.reply_to_message;
  const isReplyBot = reply_to_message?.from?.is_bot;
  console.log(message?.reply_to_message);

  if (message.reply_to_message) {
    if (isReplyBot) {
      console.log(reply_to_message?.text == messages?.login);
      switch (reply_to_message?.text) {
        case messages?.login:
          console.log(reply_to_message?.text);
          await ctx.deleteMessage();
          await ctx.sendMessage('Login');
          break;
        case messages.authenticate:
          await ctx.reply('Authenticate');
          break;
        default:
          break;
      }
    } else {
    }
  } else {
  }

  ctx.reply('👍');
};

export { reply_to_message };
