import { Telegraf } from 'telegraf';

import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import botConfig from './configs';
import MyContext from './configs/session.config';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf<MyContext>(BOT_TOKEN);

botConfig(bot);

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
