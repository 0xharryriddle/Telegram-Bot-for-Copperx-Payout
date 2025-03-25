# Troubleshooting Guide

This guide covers common issues you might encounter when setting up or using the CopperX Payout Telegram Bot and provides solutions to resolve them.

## Installation Issues

### npm/pnpm Install Errors

**Issue**: Dependencies fail to install properly.

**Solutions**:
- Clear npm/pnpm cache:
  ```bash
  npm cache clean --force
  # or
  pnpm store prune
  ```
- Try installing with the `--no-optional` flag:
  ```bash
  npm install --no-optional
  # or
  pnpm install --no-optional
  ```
- Check Node.js version compatibility:
  ```bash
  node -v  # Should be v16.x or higher
  ```

### Build Errors

**Issue**: Project fails to build with TypeScript errors.

**Solutions**:
- Fix type errors in the codebase
- Install correct TypeScript version:
  ```bash
  npm install typescript@5.x.x
  ```
- Try cleaning the project:
  ```bash
  rm -rf node_modules
  rm -rf dist
  npm install
  ```

## Connection Issues

### Bot Not Responding

**Issue**: The bot does not respond to commands.

**Solutions**:
- Verify your bot token is correct in `.env`
- Ensure the bot is running:
  ```bash
  pm2 status  # if using PM2
  # or
  ps aux | grep node  # to check running processes
  ```
- Check if the bot is blocked by the user or has been stopped
- Try restarting the bot service

### Webhook Setup Issues

**Issue**: Bot works in development but not in production with webhooks.

**Solutions**:
- Ensure your server has a valid SSL certificate (HTTPS is required for webhooks)
- Verify the webhook URL in your `.env` file:
  ```
  SERVER_URL=https://your-domain.com
  ```
- Check if the webhook is properly set using the Telegram API:
  ```
  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
  ```
- Manually reset the webhook:
  ```
  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-domain.com/webhook
  ```

### SSL Certificate Issues

**Issue**: Webhook fails with SSL certificate errors.

**Solutions**:
- Ensure your SSL certificate is valid and not expired
- Use a service like SSL Labs to verify your certificate:
  [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- Try using a service like Cloudflare to handle SSL

## Database Issues

### MongoDB Connection Errors

**Issue**: Bot fails to connect to MongoDB.

**Solutions**:
- Verify MongoDB is running:
  ```bash
  mongosh  # Check if you can connect
  ```
- Check your MongoDB connection string in `.env`
- Ensure network connectivity to MongoDB (especially if using Atlas)
- Add retry options to your connection:
  ```typescript
  mongoose.connect(MONGO_URI, {
    retryWrites: true,
    retryReads: true,
    socketTimeoutMS: 30000,
  });
  ```

### Redis Connection Issues

**Issue**: Session management fails due to Redis connection problems.

**Solutions**:
- Verify Redis is running:
  ```bash
  redis-cli ping  # Should return PONG
  ```
- Check your Redis URL in `.env`
- For cloud Redis, verify network rules allow your server to connect
- Add retry logic to your Redis connection

## Authentication Issues

### OTP Verification Fails

**Issue**: Users can't verify their OTP codes.

**Solutions**:
- Check API connectivity to CopperX servers
- Verify error messages in the logs for API validation issues
- Ensure users are entering the correct OTP from their email
- Check if OTPs have expired (they typically last only a few minutes)

### Login Session Expires Too Quickly

**Issue**: Users are frequently logged out.

**Solutions**:
- Check Redis TTL (Time To Live) settings for sessions
- Increase session timeout value in code
- Verify that refresh token logic is working correctly
- Check for memory leaks that might be clearing the session store

## API Integration Issues

### API Calls Failing

**Issue**: Requests to CopperX API fail.

**Solutions**:
- Check API connectivity with a simple test:
  ```bash
  curl -X GET https://api.copperx.io/healthcheck
  ```
- Verify authentication tokens are valid and not expired
- Check rate limiting status (you might be making too many requests)
- Look for error responses in the logs for specific error codes

### Rate Limiting

**Issue**: Bot gets rate limited by the API.

**Solutions**:
- Implement exponential backoff for retries
- Add request caching for frequent requests
- Batch requests where possible
- Spread out API calls over time

## Bot Command Issues

### Commands Not Recognized

**Issue**: Bot doesn't recognize commands.

**Solutions**:
- Ensure commands are registered with BotFather
- Check if command handlers are properly registered in your code
- Verify the command format (commands should start with `/`)
- Look for errors in the command parsing logic

### Transfers Failing

**Issue**: Users can't send funds.

**Solutions**:
- Check if users have sufficient balance
- Verify wallet validation logic
- Ensure required fields are provided (recipient, amount, currency)
- Check for API errors in the transfer process

## Deployment Issues

### Memory Leaks

**Issue**: Bot consumes increasing amounts of memory over time.

**Solutions**:
- Implement proper cleanup of resources and event listeners
- Use a process manager like PM2 with auto-restart on high memory usage:
  ```bash
  pm2 start npm --name "copperx-bot" --max-memory-restart 300M -- start
  ```
- Check for memory leaks using tools like `node --inspect`

### High CPU Usage

**Issue**: Bot uses excessive CPU.

**Solutions**:
- Look for infinite loops or inefficient code
- Implement rate limiting and throttling for heavy operations
- Check for event listener leaks
- Monitor and optimize database queries

## Notification Issues

### Pusher Notifications Not Working

**Issue**: Real-time notifications are not received.

**Solutions**:
- Verify Pusher credentials in `.env`
- Check if channels and events are correctly configured
- Ensure users are properly subscribed to notification channels
- Look for errors in the Pusher connection logic

## Logging and Debugging

### Enabling Debug Logs

For more detailed logs to help troubleshoot issues:

```bash
# Start with debug logs enabled
DEBUG=bot*,telegraf* npm run dev

# Or for Windows
$env:DEBUG='bot*,telegraf*'; npm run devWindows
```

### Log Inspection

Check logs for errors:

```bash
# View recent logs
tail -n 100 logs/bot.log

# Search for errors
grep -i error logs/bot.log
```

## Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| 401 | Unauthorized | Refresh authentication tokens or re-login |
| 403 | Forbidden | Check user permissions or API key privileges |
| 404 | Not Found | Verify resource IDs and API endpoints |
| 429 | Too Many Requests | Implement rate limiting and retry with backoff |
| 500 | Server Error | Contact CopperX support if persistent |

## Getting Help

If you've tried the solutions above and still have issues:

1. Check the [GitHub repository](https://github.com/username/copperx-payout-bot) for open issues
2. Join the [CopperX Community](https://t.me/copperxcommunity) on Telegram
3. Contact support at support@copperx.io with the following information:
   - Bot version
   - Environment (development/production)
   - Error logs
   - Steps to reproduce the issue

## Related Documentation

- [Setup Instructions](setup.md)
- [API Integration Guide](api-integration.md)
- [Command Reference](commands.md) 