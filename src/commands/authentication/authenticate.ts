import createDebug from 'debug';
import MyContext from '../../configs/session.config';

const debug = createDebug('bot:login_command');

const login = () => async (ctx: MyContext) => {
  const messageText = `Please login to your CopperX with your **email** to continue.`;
  debug(`Triggered "login" command with message \n${messageText}`);
  const sentMessage = await ctx.sendMessage(messageText, {
    parse_mode: 'Markdown',
    reply_markup: {
      force_reply: true, // This forces the user to reply to this message
      selective: true, // This makes sure that only the user who clicked the button can interact with the bot
    },
  });

  // TODO: Handle send OTP code
};

const authenticate = () => async (ctx: MyContext) => {
  const messageText = `Authenticating...\n Please enter the **code** that was sent to your email.`;
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
