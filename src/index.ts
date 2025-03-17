import { Telegraf } from 'telegraf';

import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import botRoutes from './routes';
import { Update } from 'telegraf/typings/core/types/typegram';
import MyContext from './contexts';
import * as Configs from './configs';

const BOT_TOKEN = Configs.ENV.BOT_TOKEN;
const ENVIRONMENT = Configs.ENV.NODE_ENV;

const bot = new Telegraf<MyContext<Update>>(BOT_TOKEN);

botRoutes(bot);

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
