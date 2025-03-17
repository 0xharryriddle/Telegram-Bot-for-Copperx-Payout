import { login } from 'telegraf/typings/button';

const messages = {
  start: `
    Welcome buddy ! I'm your CopperX Payout Assistant 👋👋👋\n\nUse /help to see available commands.
  `,
  help: `These are the available commands:\n\n/about - About the bot\n/help - All commands what you need\n/start - Start the bot\n/support - Contact support\n/login - Login to the Copperx Payout`,
  about: `
        This bot is created to help you with your CopperX Payout. It is a part of the CopperX Payout project.
    `,
  support: `If you have some questions or need help, please contact at:\n
  ➤ [Copperx Support](https://t.me/copperxcommunity/2183)`,
  login: `Please login to your CopperX with your email to continue.`,
  authenticate: `Authenticating...\n Please enter the **code** that was sent to your email.`,
};

export default messages;
