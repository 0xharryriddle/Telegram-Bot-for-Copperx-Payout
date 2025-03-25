import { VercelRequest, VercelResponse } from '@vercel/node';
import { Context, Telegraf } from 'telegraf';
import botRoutes from '../routes/index';
import { Update } from 'telegraf/typings/core/types/typegram';
import * as Configs from '../configs/index';

const BOT_TOKEN = Configs.ENV.BOT_TOKEN;
const SERVER_URL = Configs.ENV.SERVER_URL;

// Initialize bot
const bot = new Telegraf<Context<Update>>(BOT_TOKEN);

// Setup bot routes
botRoutes(bot);

export default async function handleWebhook(
  req: VercelRequest,
  res: VercelResponse,
) {
  try {
    if (req.method === 'POST') {
      // Handle webhook update
      await bot.handleUpdate(req.body as Update, res);
    } else if (req.method === 'GET') {
      // Setup webhook
      const webhookUrl = `${SERVER_URL}/webhook`;
      const webhookInfo = await bot.telegram.getWebhookInfo();

      if (webhookInfo.url !== webhookUrl) {
        await bot.telegram.deleteWebhook();
        await bot.telegram.setWebhook(webhookUrl);
        res.status(200).json({
          status: 'success',
          message: `Webhook set to: ${webhookUrl}`,
        });
      } else {
        res.status(200).json({
          status: 'success',
          message: `Webhook already set to: ${webhookUrl}`,
          webhook_info: webhookInfo,
        });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in webhook handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
