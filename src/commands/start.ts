import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:start_command');

const start = () => async (ctx: Context) => {
  const message = `
    Welcome buddy ! I'm your CopperX Payout Assistant 👋👋👋\n\nUse /help to see available commands.
  `;
  debug(`Triggered "start" command with message \n${message}`);
  await ctx.sendMessage(message, { parse_mode: 'Markdown' });
};

export { start };
