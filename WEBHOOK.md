# CopperX Payout Bot Webhook Setup

This guide explains how to set up and deploy the CopperX Payout Telegram Bot using webhooks.

## Environment Variables

Create a `.env` file with the following variables:

```
BOT_TOKEN=your_telegram_bot_token
SERVER_URL=https://your-domain.com  # Public-facing server URL
```

## Development Setup

For local development:

1. Install dependencies:
   ```
   npm install
   ```

2. Use ngrok to create a public URL (in a separate terminal):
   ```
   ngrok http 3000
   ```

3. Update `.env` file with the ngrok URL:
   ```
   SERVER_URL=https://your-ngrok-url.ngrok.io
   ```

4. Start the webhook server in development mode:
   ```
   npm run webhook:dev
   ```

## Production Deployment

### Option 1: Traditional Server (VPS/Dedicated)

1. Build the webhook server:
   ```
   npm run webhook:build
   ```

2. Start the server:
   ```
   npm run start
   ```

### Option 2: Vercel Deployment

1. Make sure `vercel.json` has the webhook route configured.

2. Deploy to Vercel:
   ```
   vercel --prod
   ```

## Testing Your Webhook

Visit your webhook URL to check its status:
```
https://your-domain.com/
```

You should see a status page with the bot's current webhook configuration.

For more details, check these endpoints:
- `/webhook-info` - See current webhook status
- `/set-webhook` - Manually set webhook
- `/delete-webhook` - Delete current webhook

## Bot Features

### Interactive Menus

The bot uses interactive menus for better user experience:

- 💰 **Wallet Menu**: View wallets, check balance, set default wallet
- 🔄 **Transfer Menu**: Send funds, view history, withdraw
- 👤 **Account Menu**: Login, view profile, check KYC, logout
- ℹ️ **Help Menu**: Get help with commands

### Commands

- `/start` - Start the bot and show main menu
- `/login` - Login to your CopperX account
- `/wallet` - View your wallets
- `/balance` - Check your wallet balances
- `/send` - Send funds to email or wallet
- `/history` - View transaction history
- `/withdraw` - Withdraw funds
- `/help` - Show all commands

## Troubleshooting

1. **Webhook not working**: Check if your domain is accessible and has a valid SSL certificate.

2. **Bot not responding**: Ensure that the webhook is properly set by visiting `/webhook-info`.

3. **Server errors**: Check server logs for any issues.

## Security Considerations

- Always use HTTPS for webhooks
- Keep your BOT_TOKEN secure
- Consider implementing rate limiting for public endpoints 