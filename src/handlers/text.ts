import { Context } from 'telegraf';

const text = () => async (ctx: Context) => {
  await ctx.reply('👉🏻👈🏻');
};

export { text };
