import { Telegraf } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:development');

/**
 * Setup development mode
 */
const development = async (bot: Telegraf) => {
  const botInfo = await bot.telegram.getMe();
  debug('Bot starting in development mode...');
  debug(`${botInfo.username} deleting webhook`);
  await bot.telegram.deleteWebhook();
  debug(`${botInfo.username} starting polling`);

  try {
    await bot.launch();
  } catch (error) {
    debug('Error launching bot:', error);
    throw error;
  }
};

export default development;
