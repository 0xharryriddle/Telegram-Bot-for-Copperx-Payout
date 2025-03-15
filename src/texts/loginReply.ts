import createDebug from 'debug';
import MyContext from '../configs/session.config';

const debug = createDebug('bot:login_text');

const replyToMessage = (ctx: MyContext, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_parameters: { message_id: messageId },
  });

const loginReply = () => async (ctx: MyContext) => {
  debug('Triggered "loginReply" text command');

  const messageId = ctx.message?.message_id;

  debug(`${messageId} - ${ctx.message?.from.id} - ${ctx.botInfo.id}`);

  if (messageId && ctx.message?.from.id === ctx.botInfo.id) {
    await replyToMessage(ctx, messageId, `Thank you for your answer`);
  }
};

export { loginReply };
