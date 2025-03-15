import { session, Telegraf } from 'telegraf';
const { message } = require('telegraf/filters');

import * as Commands from '../commands';
import * as Texts from '../texts';
import MyContext from './session.config';

const botConfig = (bot: Telegraf<MyContext>) => {
  bot.use(session());
  // Menu
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'All commands what you need' },
    { command: 'support', description: 'Contact support' },
    { command: 'login', description: 'Login to the Copperx Payout' },
  ]);

  // Commands
  bot.command('start', Commands.start());
  bot.command('help', Commands.help());
  bot.command('support', Commands.support());
  bot.command('login', Commands.login());

  // Actions - Callbacks
  bot.action('startLogin', Commands.login());
  bot.action('startLogin', Commands.login());
  // Handle the Reply of users
  bot.hears(['login', 'startLogin'], Commands.authenticate());
  bot.on(message('sticker'), (ctx: MyContext) => ctx.reply('👍'));
};

export default botConfig;
