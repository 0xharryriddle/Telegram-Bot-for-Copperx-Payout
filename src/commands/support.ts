import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import messages from '../message';
import MyContext from '../contexts';

const debug = createDebug('bot:clear_command');

const support = () => async (ctx: MyContext<Update>) => {
  const message = `🤖 *Need Help?*

We're here to assist you with any questions or issues you may have.

*Contact Options:*
• Join our [Copperx Community](https://t.me/copperxcommunity/2183) for support
• Visit our website: https://copperx.io
• Email us at support@copperx.io

*Common Topics:*
• Account setup and verification
• Deposits and withdrawals
• Transaction issues
• Security concerns

Our support team typically responds within 24 hours.`;

  debug(`Triggered "support" command with message \n${message}`);
  await ctx.sendMessage(message, { parse_mode: 'Markdown' });
};

export { support };
