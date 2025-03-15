import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:start_command');

const start = () => async (ctx: Context) => {
  const startMessage = `
    Welcome buddy ! I'm your CopperX Payout Assistant 👋👋👋\n\nUse /help to see available commands.
  `;
  debug(`Triggered "start" command with message \n${startMessage}`);
  await ctx.sendMessage(startMessage, { parse_mode: 'Markdown' });

  const loginMessage = ``;
  debug(`Triggered "start" command with message \n${loginMessage}`);
};

export { start };
