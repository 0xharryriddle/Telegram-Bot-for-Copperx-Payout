import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:help_command');

const help = () => async (ctx: Context) => {
  const message = `These are the available commands:\n\n/about - About the bot\n/help - All commands what you need\n/start - Start the bot\n/support - Contact support`;
  debug(`Triggered "help" command with message \n${message}`);
  await ctx.sendMessage(message, { parse_mode: 'Markdown' });
};

export { help };
