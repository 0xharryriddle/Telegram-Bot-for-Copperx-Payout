import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf';
import MyContext from '../../contexts';
import { TransferService } from '../../../api/services/transfer.service';

const debug = createDebug('bot:send_command');

const transferService = new TransferService();

// State for the send flow
interface SendState {
  step: 'recipient' | 'amount' | 'currency' | 'confirm';
  recipient?: string;
  amount?: number;
  currency?: string;
  isEmail: boolean;
}

const sendStates = new Map<number, SendState>();

const send = () => async (ctx: MyContext<Update>) => {
  debug('Triggered "send" command');
  
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId) {
      return await ctx.reply('❌ Error: Could not identify user.');
    }
    
    // Initialize the send flow
    sendStates.set(telegramId, {
      step: 'recipient',
      isEmail: true
    });
    
    await ctx.reply(
      '💸 *Send Funds*\n\n' +
      'Please choose the recipient type:',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('📧 Email', 'send_email')],
          [Markup.button.callback('🔑 Wallet Address', 'send_wallet')],
          [Markup.button.callback('❌ Cancel', 'send_cancel')]
        ])
      }
    );
  } catch (error) {
    debug('Error in send command:', error);
    await ctx.reply('❌ An error occurred. Please try again later.');
  }
};

const handleSendEmail = () => async (ctx: MyContext<Update>) => {
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId || !sendStates.has(telegramId)) {
      return await ctx.reply('❌ Please start the send process with /send');
    }
    
    const state = sendStates.get(telegramId)!;
    state.isEmail = true;
    state.step = 'recipient';
    
    await ctx.editMessageText(
      '📧 *Send to Email*\n\n' +
      'Please enter the recipient\'s email address:',
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    debug('Error in handleSendEmail:', error);
    await ctx.reply('❌ An error occurred. Please try again later.');
  }
};

const handleSendWallet = () => async (ctx: MyContext<Update>) => {
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId || !sendStates.has(telegramId)) {
      return await ctx.reply('❌ Please start the send process with /send');
    }
    
    const state = sendStates.get(telegramId)!;
    state.isEmail = false;
    state.step = 'recipient';
    
    await ctx.editMessageText(
      '🔑 *Send to Wallet Address*\n\n' +
      'Please enter the recipient\'s wallet address:',
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    debug('Error in handleSendWallet:', error);
    await ctx.reply('❌ An error occurred. Please try again later.');
  }
};

const handleSendCancel = () => async (ctx: MyContext<Update>) => {
  try {
    const telegramId = ctx.from?.id;
    
    if (telegramId) {
      sendStates.delete(telegramId);
    }
    
    await ctx.editMessageText('❌ Send operation cancelled.');
  } catch (error) {
    debug('Error in handleSendCancel:', error);
    await ctx.reply('❌ An error occurred. Please try again later.');
  }
};

const handleSendMessage = () => async (ctx: MyContext<Update>) => {
  try {
    const telegramId = ctx.from?.id;
    const messageText = (ctx.message as any)?.text;
    
    if (!telegramId || !sendStates.has(telegramId) || !messageText) {
      return;
    }
    
    const state = sendStates.get(telegramId)!;
    
    switch (state.step) {
      case 'recipient':
        state.recipient = messageText;
        state.step = 'amount';
        
        await ctx.reply(
          '💰 *Amount*\n\n' +
          'Please enter the amount to send:',
          { parse_mode: 'Markdown' }
        );
        break;
        
      case 'amount':
        const amount = parseFloat(messageText);
        
        if (isNaN(amount) || amount <= 0) {
          return await ctx.reply('❌ Please enter a valid amount.');
        }
        
        state.amount = amount;
        state.step = 'currency';
        
        await ctx.reply(
          '💱 *Currency*\n\n' +
          'Please enter the currency (e.g., USDC):',
          { parse_mode: 'Markdown' }
        );
        break;
        
      case 'currency':
        state.currency = messageText.toUpperCase();
        state.step = 'confirm';
        
        await ctx.reply(
          '✅ *Confirm Transaction*\n\n' +
          `Recipient: ${state.recipient}\n` +
          `Amount: ${state.amount} ${state.currency}\n\n` +
          'Please confirm this transaction:',
          {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
              [Markup.button.callback('✅ Confirm', 'send_confirm')],
              [Markup.button.callback('❌ Cancel', 'send_cancel')]
            ])
          }
        );
        break;
    }
  } catch (error) {
    debug('Error in handleSendMessage:', error);
    await ctx.reply('❌ An error occurred. Please try again later.');
  }
};

const handleSendConfirm = () => async (ctx: MyContext<Update>) => {
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId || !sendStates.has(telegramId)) {
      return await ctx.reply('❌ Please start the send process with /send');
    }
    
    const state = sendStates.get(telegramId)!;
    
    if (state.step !== 'confirm' || !state.recipient || !state.amount || !state.currency) {
      return await ctx.reply('❌ Please complete all steps before confirming.');
    }
    
    // Show loading message
    await ctx.editMessageText('🔄 Processing your transaction...');
    
    let result;
    
    if (state.isEmail) {
      // Send to email
      result = await transferService.sendFundsToEmail(
        telegramId,
        state.recipient,
        state.amount,
        state.currency
      );
    } else {
      // Send to wallet address
      // Note: This is simplified, in a real implementation you would need to specify the network
      result = await transferService.sendFundsToWallet(
        telegramId,
        state.recipient,
        state.amount,
        state.currency,
        'solana' // Default to Solana for simplicity
      );
    }
    
    if (!result.success) {
      return await ctx.editMessageText(`❌ ${result.message}`);
    }
    
    // Clear the state
    sendStates.delete(telegramId);
    
    await ctx.editMessageText(
      '✅ *Transaction Successful*\n\n' +
      `You have sent ${state.amount} ${state.currency} to ${state.recipient}.\n\n` +
      'Use /history to view your transaction history.',
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    debug('Error in handleSendConfirm:', error);
    await ctx.reply('❌ An error occurred while processing your transaction. Please try again later.');
  }
};

export { 
  send, 
  handleSendEmail, 
  handleSendWallet, 
  handleSendCancel, 
  handleSendMessage, 
  handleSendConfirm 
}; 