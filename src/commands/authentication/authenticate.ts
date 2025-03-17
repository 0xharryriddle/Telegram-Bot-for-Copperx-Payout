import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import messages from '../../message';
import MyContext from '../../contexts';

const debug = createDebug('bot:login_command');

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
  // TODO: Handle send OTP code
};

const authenticate = () => async (ctx: MyContext<Update>) => {
  const messageText = messages.authenticate;

  debug(`Triggered "authenticate" command with message \n${messageText}`);

  const sentMessage = await ctx.sendMessage(messageText, {
    parse_mode: 'Markdown',
    reply_markup: {
      force_reply: true, // This forces the user to reply to this message
      selective: true, // This makes sure that only the user who clicked the button can interact with the bot
    },
  });

  // TODO: Handle the OTP code
};

export { login, authenticate };
