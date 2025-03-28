import { Context, Telegraf } from 'telegraf';
// import './api/databases/redis';
import { Request, Response } from 'express';
import { setUp } from './api/databases/index';
import Routes from './routes/index';
import * as Configs from './configs/index';
import production from './core/production';
import { setupMenus } from './menus/index';
import createDebug from 'debug';
import { NotificationService } from './api/services/notification.service';
import { Update } from 'telegraf/types';

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

// Start the bot based on environment
async function startBot() {
  try {
    await setUp();
    Configs.logger.info('Databases connected successfully!');

    await NotificationService.getInstance().subscribeForAll(
      bot.context as Context<Update>,
    );
    if (Configs.ENV.NODE_ENV === 'production') {
      await production(bot);
      Configs.logger.info('Bot started in production mode');
    } else {
      await bot.launch();
    }
  } catch (error) {
    Configs.logger.info('Error starting bot:', error);
  }
}

startBot()
  .then(() => process.exit(0))
  .catch((err) => process.exit(1));

// Enable graceful stop
process.once('SIGINT', () => {
  console.log('SIGINT received, stopping bot');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  console.log('SIGTERM received, stopping bot');
  bot.stop('SIGTERM');
});
