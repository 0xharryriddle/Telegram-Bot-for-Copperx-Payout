import createDebug from 'debug';
import MyContext from '../configs/session.config';

const debug = createDebug('bot:help_command');

const help = () => async (ctx: MyContext) => {
  const message = `These are the available commands:\n\n/about - About the bot\n/help - All commands what you need\n/start - Start the bot\n/support - Contact support\n/login - Login to the Copperx Payout`;
  debug(`Triggered "help" command with message \n${message}`);
  await ctx.sendMessage(message, { parse_mode: 'Markdown' });
};

export { help };
