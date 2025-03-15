import createDebug from 'debug';
import MyContext from '../configs/session.config';

const debug = createDebug('bot:clear_command');

const support = () => async (ctx: MyContext) => {
  const message = `If you have some questions or need help, please contact at:\n
  ➤ [Copperx Support](https://t.me/copperxcommunity/2183)`;
  debug(`Triggered "support" command with message \n${message}`);
  await ctx.sendMessage(message, { parse_mode: 'Markdown' });
};

export { support };
