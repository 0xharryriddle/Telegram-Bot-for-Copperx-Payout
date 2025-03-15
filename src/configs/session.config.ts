import { Context } from 'telegraf';

interface SessionData {
  messageCount: number;
  lastMessageIds?: number[];
  lastMessageTexts?: string[];
}

interface MyContext extends Context {
  session?: SessionData;
  // ... more props go here
}

export default MyContext;
