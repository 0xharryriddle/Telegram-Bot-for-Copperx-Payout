import { Update } from 'telegraf/typings/core/types/typegram';
import createDebug from 'debug';
import MyContext from '../contexts';

const debug = createDebug('bot:message_service');

const callback = () => async (ctx: MyContext<Update>) => {
  await ctx.sendMessage('👍');
  debug('Callback service');
};

export { callback };
