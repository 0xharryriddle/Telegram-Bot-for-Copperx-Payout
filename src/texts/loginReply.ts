import createDebug from 'debug';
import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

const debug = createDebug('bot:login_text');

const replyToMessage = (
  ctx: Context<Update>,
  messageId: number,
  string: string,
) =>
  ctx.reply(string, {
    reply_parameters: { message_id: messageId },
  });

const loginReply = () => async (ctx: Context<Update>) => {
  debug('Triggered "loginReply" text command');

  const messageId = ctx.message?.message_id;

  debug(`${messageId} - ${ctx.message?.from.id} - ${ctx.botInfo.id}`);

  if (messageId && ctx.message?.from.id === ctx.botInfo.id) {
    await replyToMessage(ctx, messageId, `Thank you for your answer`);
  }
};

export { loginReply };
