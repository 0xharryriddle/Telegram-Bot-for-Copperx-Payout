import createDebug from 'debug';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Markup } from 'telegraf';
import MyContext from '../../contexts';
import { TransferService } from '../../../api/services/transfer.service';
import { AuthService } from '../../../api/services/auth.service';

const debug = createDebug('bot:withdraw_command');

const transferService = new TransferService();
const authService = new AuthService();

// State for the withdraw flow
interface WithdrawState {
  step: 'amount' | 'currency' | 'confirm';
  amount?: number;
  currency?: string;
}

const withdrawStates = new Map<number, WithdrawState>();

const withdraw = () => async (ctx: MyContext<Update>) => {
  debug('Triggered "withdraw" command');
  
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId) {
      return await ctx.reply('❌ Error: Could not identify user.');
    }
    
    // Check KYC status first
    const kycResult = await authService.getKYCStatus(telegramId);
    
    if (!kycResult.success) {
      return await ctx.reply(`❌ ${kycResult.message}`);
    }
    
    // Check if KYC is approved
    const kycStatus = kycResult.kycStatus;
    if (!kycStatus || kycStatus.status !== 'approved') {
      return await ctx.reply(
        '❌ *KYC Not Approved*\n\n' +
        'You need to complete KYC verification before you can withdraw to a bank account.\n\n' +
        'Please visit the Copperx platform to complete your KYC.',
        { parse_mode: 'Markdown' }
      );
    }
    
    // Initialize the withdraw flow
    withdrawStates.set(telegramId, {
      step: 'amount'
    });
    
    await ctx.reply(
      '🏦 *Withdraw to Bank*\n\n' +
      'Please enter the amount you want to withdraw:',
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    debug('Error in withdraw command:', error);
    await ctx.reply('❌ An error occurred. Please try again later.');
  }
};

const handleWithdrawMessage = () => async (ctx: MyContext<Update>) => {
  try {
    const telegramId = ctx.from?.id;
    const messageText = (ctx.message as any)?.text;
    
    if (!telegramId || !withdrawStates.has(telegramId) || !messageText) {
      return;
    }
    
    const state = withdrawStates.get(telegramId)!;
    
    switch (state.step) {
      case 'amount':
        const amount = parseFloat(messageText);
        
        if (isNaN(amount) || amount <= 0) {
          return await ctx.reply('❌ Please enter a valid amount.');
        }
        
        // Check if amount meets minimum withdrawal requirement
        if (amount < 10) { // Example minimum amount
          return await ctx.reply(
            '❌ The minimum withdrawal amount is 10 USDC.\n\n' +
            'Please enter a larger amount.'
          );
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
          '✅ *Confirm Withdrawal*\n\n' +
          `Amount: ${state.amount} ${state.currency}\n\n` +
          'Please confirm this withdrawal to your bank account:',
          {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
              [Markup.button.callback('✅ Confirm', 'withdraw_confirm')],
              [Markup.button.callback('❌ Cancel', 'withdraw_cancel')]
            ])
          }
        );
        break;
    }
  } catch (error) {
    debug('Error in handleWithdrawMessage:', error);
    await ctx.reply('❌ An error occurred. Please try again later.');
  }
};

const handleWithdrawConfirm = () => async (ctx: MyContext<Update>) => {
  try {
    const telegramId = ctx.from?.id;
    
    if (!telegramId || !withdrawStates.has(telegramId)) {
      return await ctx.reply('❌ Please start the withdraw process with /withdraw');
    }
    
    const state = withdrawStates.get(telegramId)!;
    
    if (state.step !== 'confirm' || !state.amount || !state.currency) {
      return await ctx.reply('❌ Please complete all steps before confirming.');
    }
    
    // Show loading message
    await ctx.editMessageText('🔄 Processing your withdrawal...');
    
    // Process withdrawal
    const result = await transferService.withdrawToBank(
      telegramId,
      state.amount,
      state.currency
    );
    
    if (!result.success) {
      return await ctx.editMessageText(`❌ ${result.message}`);
    }
    
    // Clear the state
    withdrawStates.delete(telegramId);
    
    await ctx.editMessageText(
      '✅ *Withdrawal Initiated*\n\n' +
      `You have initiated a withdrawal of ${state.amount} ${state.currency} to your bank account.\n\n` +
      'The funds will be credited to your bank account within 1-3 business days.\n\n' +
      'Use /history to view your transaction history.',
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    debug('Error in handleWithdrawConfirm:', error);
    await ctx.reply('❌ An error occurred while processing your withdrawal. Please try again later.');
  }
};

const handleWithdrawCancel = () => async (ctx: MyContext<Update>) => {
  try {
    const telegramId = ctx.from?.id;
    
    if (telegramId) {
      withdrawStates.delete(telegramId);
    }
    
    await ctx.editMessageText('❌ Withdrawal cancelled.');
  } catch (error) {
    debug('Error in handleWithdrawCancel:', error);
    await ctx.reply('❌ An error occurred. Please try again later.');
  }
};

export { 
  withdraw, 
  handleWithdrawMessage, 
  handleWithdrawConfirm, 
  handleWithdrawCancel 
}; 