import { Telegraf, session, type Context } from 'telegraf';
import type { Update } from 'telegraf/types';

enum MessageType {
  EMAIL_REQUEST = 'email_request',
  OTP_REQUEST = 'otp_request',
  CONFIRMATION = 'confirmation',
}

interface SessionData {
  awaitingReplyType?: MessageType;
  awaitingReplyToMessageId?: number;
  email?: string;
  // Add other session data as needed
}

interface MyContext<U extends Update = Update> extends Context<U> {
  session: SessionData;
}

export default MyContext;
