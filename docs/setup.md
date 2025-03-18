# Deposit Notification Setup Guide

This guide will help you set up the deposit notification feature for the Telegram bot using Pusher.

## Prerequisites

1. A Pusher account (https://pusher.com)
2. Node.js installed on your system
3. pnpm installed globally (`npm install -g pnpm`)
4. MongoDB installed and running
5. The Telegram bot token

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Pusher Configuration
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster

# MongoDB Configuration
MONGODB_URI=your_mongodb_uri
```

## Pusher Setup

1. Log in to your Pusher account
2. Create a new app or select an existing one
3. Go to the app's settings
4. Enable the following features:
   - Client events
   - Private channels
   - Webhooks (optional, for additional functionality)
5. Copy the following credentials to your `.env` file:
   - App ID
   - Key
   - Secret
   - Cluster

## Installation

1. Install the required dependencies:

```bash
pnpm install pusher pusher-js
```

2. Build the project:

```bash
pnpm run build
```

3. Start the bot:

```bash
pnpm start
```

## Usage

1. Start a chat with your Telegram bot
2. Use the `/login` command to authenticate
3. Use the `/deposit_notification` command to subscribe to deposit notifications
4. You will receive notifications for all new deposits in your account

## Notification Format

When a deposit is received, you'll get a message in this format:

```
💰 New Deposit Received!

Amount: [amount] [currency]
Status: [status]
Time: [timestamp]

Transaction ID: [transaction_id]
```

## Troubleshooting

1. If you don't receive notifications:
   - Check if you're properly logged in using `/login`
   - Verify your Pusher credentials in the `.env` file
   - Check the bot logs for any error messages

2. If the bot doesn't start:
   - Verify all environment variables are set correctly
   - Check if MongoDB is running
   - Check the logs for any startup errors

3. If you get authentication errors:
   - Verify your Pusher credentials
   - Check if your Pusher app has private channels enabled
   - Ensure your bot has the necessary permissions

## Security Considerations

1. Never share your Pusher credentials
2. Keep your `.env` file secure and never commit it to version control
3. Regularly rotate your Pusher keys
4. Monitor your Pusher dashboard for any suspicious activity

## Support

If you encounter any issues:
1. Check the logs using the debug mode
2. Join our [Copperx Community](https://t.me/copperxcommunity/2183) for support
3. Contact support at support@copperx.io
