import MyContext from '../contexts';
import { Update } from 'telegraf/typings/core/types/typegram';

const text = () => async (ctx: MyContext<Update>) => {
  await ctx.reply('👉🏻👈🏻');
};

export { text };
