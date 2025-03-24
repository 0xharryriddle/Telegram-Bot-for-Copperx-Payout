import express from 'express';
import { Telegraf } from 'telegraf';
import * as Configs from './configs';
import { setupMenus } from './menus';
import botRoutes from './routes';
import bodyParser from 'body-parser';
import * as path from 'path';

// Environment variables
const BOT_TOKEN = Configs.ENV.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const SERVER_URL = Configs.ENV.SERVER_URL;
const WEBHOOK_PATH = '/webhook';

// Initialize bot with standard context
const bot = new Telegraf(BOT_TOKEN);

// Setup bot routes and interactive menus
botRoutes(bot);
setupMenus(bot);

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send(`
    <html>
      <head>
        <title>CopperX Payout Bot</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          h1 {
            color: #1e88e5;
            border-bottom: 2px solid #1e88e5;
            padding-bottom: 10px;
          }
          .status {
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 10px 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
          }
          .commands {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          code {
            background: #eee;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <h1>CopperX Payout Telegram Bot</h1>
        <div class="status">
          <p><strong>Status:</strong> Running</p>
          <p><strong>Webhook URL:</strong> ${SERVER_URL}${WEBHOOK_PATH}</p>
        </div>
        <div class="commands">
          <h3>Available Bot Commands:</h3>
          <ul>
            <li><code>/start</code> - Start the bot</li>
            <li><code>/login</code> - Login to CopperX</li>
            <li><code>/wallet</code> - View your wallets</li>
            <li><code>/balance</code> - Check balances</li>
            <li><code>/send</code> - Send funds to email or wallet</li>
            <li><code>/history</code> - View transaction history</li>
            <li><code>/withdraw</code> - Withdraw funds</li>
            <li><code>/help</code> - Show all commands</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Get webhook info endpoint
app.get('/webhook-info', async (req, res) => {
  try {
    const webhookInfo = await bot.telegram.getWebhookInfo();
    res.status(200).json({
      status: 'success',
      webhook_info: webhookInfo,
    });
  } catch (error) {
    console.error('Error getting webhook info:', error);
    res.status(500).json({ error: 'Failed to get webhook info' });
  }
});

// Set webhook endpoint
app.get('/set-webhook', async (req, res) => {
  try {
    const webhookUrl = `${SERVER_URL}${WEBHOOK_PATH}`;
    await bot.telegram.deleteWebhook();
    await bot.telegram.setWebhook(webhookUrl);
    res.status(200).json({
      status: 'success',
      message: `Webhook set to: ${webhookUrl}`,
    });
  } catch (error) {
    console.error('Error setting webhook:', error);
    res.status(500).json({ error: 'Failed to set webhook' });
  }
});

// Delete webhook endpoint
app.get('/delete-webhook', async (req, res) => {
  try {
    await bot.telegram.deleteWebhook();
    res.status(200).json({
      status: 'success',
      message: 'Webhook deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
});

// Webhook endpoint - this is where Telegram will send updates
app.post(WEBHOOK_PATH, (req, res) => {
  bot.handleUpdate(req.body, res);
});

// Setup webhook and start server
async function startServer() {
  try {
    // Set webhook only in production mode
    if (Configs.ENV.NODE_ENV === 'production') {
      const webhookUrl = `${SERVER_URL}${WEBHOOK_PATH}`;
      const webhookInfo = await bot.telegram.getWebhookInfo();

      if (webhookInfo.url !== webhookUrl) {
        await bot.telegram.deleteWebhook();
        await bot.telegram.setWebhook(webhookUrl);
        Configs.logger.info(`Webhook set to: ${webhookUrl}`);
      } else {
        Configs.logger.info(`Webhook already set to: ${webhookUrl}`);
      }
    } else {
      // In development, we use polling mode (handled in index.ts)
      Configs.logger.info(
        'Development mode: Running server without setting webhook',
      );
    }

    // Start server
    app.listen(PORT, () => {
      Configs.logger.info(
        `CopperX Payout Bot webhook server is running on port ${PORT}`,
      );
      if (Configs.ENV.NODE_ENV === 'production') {
        Configs.logger.info(`Webhook is set to: ${SERVER_URL}${WEBHOOK_PATH}`);
      }
    });
  } catch (error) {
    Configs.logger.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  process.exit(0);
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  process.exit(0);
});
