# Setup Instructions

This guide will help you set up and deploy the CopperX Payout Telegram Bot on your server.

## Prerequisites

1. Node.js (v16 or higher)
2. pnpm or npm package manager
3. MongoDB database
4. Redis instance (for session management)
5. A Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
6. A server with HTTPS support for webhooks (for production)
7. Pusher account for real-time notifications (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Node Environment
NODE_ENV=development  # or production

# Server Settings
PORT=3000
BASE_URL=http://localhost:3000  # Local development
SERVER_URL=https://your-domain.com  # Production URL with HTTPS

# Telegram Bot
BOT_TOKEN=your_telegram_bot_token

# Database URLs
MONGO_URI=mongodb://localhost:27017/copperx-payout
REDIS_URL=redis://localhost:6379

# Pusher Configuration (Optional - for real-time notifications)
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/username/copperx-payout-bot.git
cd copperx-payout-bot
```

2. Install dependencies:

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

3. Build the project:

```bash
pnpm build
# or
npm run build
```

## Running in Development Mode

For local development, the bot uses polling mode which doesn't require HTTPS:

```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev

# For Windows
pnpm devWindows
# or
npm run devWindows
```

The bot will start in polling mode and connect to Telegram's API. You should see logs indicating a successful connection.

## Running in Production Mode

In production, the bot uses a webhook server which requires HTTPS:

1. Ensure your `SERVER_URL` in `.env` is a valid HTTPS URL.

2. Start the production server:

```bash
pnpm start
# or
npm start
```

3. The webhook will be automatically registered with Telegram.

## SSL Certificate for Production

For webhook mode, you need a valid SSL certificate. You can:

1. Use a reverse proxy like Nginx with Let's Encrypt
2. Use a service like Cloudflare for SSL termination
3. Deploy on a platform like Vercel, Heroku, or Render which handles SSL for you

## Deploying to Render

This bot can be easily deployed to [Render](https://render.com):

1. Create a new Web Service
2. Connect your Git repository
3. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add all required environment variables in the Render dashboard
5. Ensure `NODE_ENV` is set to `production`

## Database Setup

### MongoDB

1. Create a MongoDB database (local or cloud-based like MongoDB Atlas)
2. Update the `MONGO_URI` in your `.env` file with the connection string
3. The bot will automatically create the required collections on startup

### Redis

1. Set up a Redis instance (local or cloud-based like Redis Labs)
2. Update the `REDIS_URL` in your `.env` file
3. Redis is used for storing session data and temporary caches

## Pusher Setup (Optional)

For real-time notifications (e.g., deposit alerts):

1. Create a [Pusher](https://pusher.com) account
2. Create a new app in the Pusher dashboard
3. Enable client events and private channels
4. Copy your app credentials to the `.env` file
5. The notification system will work automatically if all credentials are provided

## Bot Configuration

### Setting up with BotFather

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the instructions to create a new bot
3. Copy the token provided and add it to your `.env` file as `BOT_TOKEN`
4. Set up commands for your bot with `/setcommands` in BotFather:

```
start - Start the bot
login - Log in with your email
otp - Verify OTP code to login
setpassword - Set password to protect your account
wallet - View your wallet information
balance - Check your wallet balance
send - Send funds to another user
history - View your transaction history
withdraw - Withdraw funds to your bank account
profile - View your profile information
kyc - Check your KYC status
help - Show all available commands
logout - Log out from your account
```

5. Set a profile picture with `/setuserpic`
6. Set a description with `/setdescription`

## Verification

To verify your setup is working:

1. Start a chat with your bot on Telegram
2. Send the `/start` command
3. You should receive a welcome message with available commands
4. Check the console logs for any errors or warnings

## Updating the Bot

To update the bot to a newer version:

1. Pull the latest changes from the repository
2. Install any new dependencies
3. Rebuild the project
4. Restart the service

```bash
git pull
pnpm install
pnpm build
pnpm start
```

## Related Documentation

- [API Integration Guide](api-integration.md)
- [Command Reference](commands.md)
- [Troubleshooting Guide](troubleshooting.md)
