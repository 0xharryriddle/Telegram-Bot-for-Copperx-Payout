import { Context, Telegraf } from 'telegraf';
import createDebug from 'debug';
import express from 'express';
import * as Configs from '../configs/index';
import { Update } from 'telegraf/types';

const debug = createDebug('bot:production');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_PATH = 'secret-path'; // Path for the webhook
const SERVER_URL = Configs.ENV.SERVER_URL;

/**
 * Setup production mode with webhook
 */
const production = async (bot: Telegraf<Context<Update>>) => {
  debug('Bot starting in production mode...');
  console.log('Bot starting in production mode...');

  try {
    // Set up webhook
    const webhookUrl = `${SERVER_URL}/${SECRET_PATH}`;
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`Webhook set to: ${webhookUrl}`);
    debug(`Webhook set to: ${webhookUrl}`);

    // Setup express app to handle webhook
    app.use(bot.webhookCallback(`/${SECRET_PATH}`));

    // Start express server
    app.listen(PORT, () => {
      debug(`Express server is listening on port ${PORT}`);
    });
  } catch (error) {
    debug('Error setting webhook:', error);
    throw error;
  }
};

export default production;
