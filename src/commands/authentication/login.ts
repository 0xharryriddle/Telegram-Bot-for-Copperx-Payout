import { Context } from 'telegraf';
import createDebug from 'debug';
// import * as LoginUI from '../../ui/login.html';

const debug = createDebug('bot:help_command');

const login = () => async (ctx: Context) => {
  //   const message = LoginUI.getHTML();
  const message = `
    <html>
        <head><title>Telegram</title></head>
        <body>
            <form method="GET" action="https://api.telegram.org/bot(token)/sendMessage">
                <input type="hidden" name="chat_id" value="@testadminch">
                <input type="hidden" name="parse_mod" value="markdown">
                <textarea name="text"></textarea>
                <input type="submit" value="Submit">
            </form>
        </body>
    </html>
    `;

  debug(`Triggered "login" command to show login UI \n${message}`);
  await ctx.sendMessage(message, { parse_mode: 'HTML' });
};

export { login };
