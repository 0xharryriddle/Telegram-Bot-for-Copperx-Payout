import createDebug from 'debug';
import MyContext from '../configs/session.config';

const debug = createDebug('bot:start_command');

const start = () => async (ctx: MyContext) => {
  const startMessage = `
    Welcome buddy ! I'm your CopperX Payout Assistant 👋👋👋\n\nUse /help to see available commands.
  `;
  debug(`Triggered "start" command with message \n${startMessage}`);
  await ctx.sendMessage(startMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Login',
            callback_data: 'startLogin',
          },
        ],
      ],
    },
  });
};

export { start };
