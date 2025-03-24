import { Update } from 'telegraf/typings/core/types/typegram';
import createDebug from 'debug';
import { Context } from 'telegraf';

const debug = createDebug('bot:message_service');

const callback = () => async (ctx: Context<Update>) => {
  await ctx.sendMessage('👍');
  debug('Callback service');
};

export { callback };
