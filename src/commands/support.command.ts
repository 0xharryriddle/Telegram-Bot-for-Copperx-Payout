import createDebug from 'debug';
import { Context } from 'telegraf';
import { Markup } from 'telegraf';

const debug = createDebug('bot:support_command');

const support = () => async (ctx: Context) => {
  const messageText = `📞 *CopperX Support*

Need help with your CopperX account? Contact our support team:

📧 *Email*: support@copperx.io
🌐 *Website*: https://copperx.io/contact
⏱️ *Support Hours*: Monday to Friday, 9 AM - 5 PM (UTC)

For immediate assistance, please provide your username, Telegram ID, and a detailed description of your issue when reaching out.`;

  debug('Support command triggered');
  
  await ctx.reply(messageText, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      Markup.button.url('Visit Support Center', 'https://copperx.io/support')
    ])
  });
};

export { support };
