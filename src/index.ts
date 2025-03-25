import { Telegraf } from 'telegraf';
// import './api/databases/redis';
import { Request, Response } from 'express';
import { databases, setUp } from './api/databases';
import Routes from './routes';
import * as Configs from './configs';
import development from './core/development';
import production from './core/production';
import { setupMenus } from './menus';
import createDebug from 'debug';

const debug = createDebug('bot:index');

// Initialize the bot with token from environment variables
const bot = new Telegraf(Configs.ENV.BOT_TOKEN);

Routes(bot);
setupMenus(bot);

// Simple start command to verify bot is running
bot.command('start', (ctx) => {
  console.log('Start command received');
  ctx.reply('Bot is up and running! 🚀');
});

//prod mode (Express)
export const startExpress = async (req: Request, res: Response) => {
  await production(bot);
};

// Start the bot based on environment
async function startBot() {
  try {
    await setUp();
    debug('Databases connected successfully!');
    if (Configs.ENV.NODE_ENV === 'production') {
      await production(bot);
      debug('Bot started in production mode');
    } else {
      await bot.launch();
    }
  } catch (error) {
    debug('Error starting bot:', error);
  }
}

if (Configs.ENV.NODE_ENV !== 'production') {
  startBot().catch((err) => {
    process.exit(1);
  });
}

// Enable graceful stop
process.once('SIGINT', () => {
  console.log('SIGINT received, stopping bot');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  console.log('SIGTERM received, stopping bot');
  bot.stop('SIGTERM');
});
