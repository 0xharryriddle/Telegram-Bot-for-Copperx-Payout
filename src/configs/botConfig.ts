import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

import { help, start, support } from '../commands';

const botConfig = (bot: Telegraf<Context<Update>>) => {
  bot.command('start', start());
  bot.command('help', help());
  bot.command('support', support());
};

export default botConfig;
