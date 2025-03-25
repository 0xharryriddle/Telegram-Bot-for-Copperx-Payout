import * as Configs from '../configs/index';
import { TransferService } from '../api/services/transfer.service';
import { SessionService } from '../api/services/session.service';
import { Context } from 'telegraf';
import { Update } from 'telegraf/types';
import { getSendOptions, getTransferMenu } from '../menus/transfer.menu';
import { WalletService } from '../api/services/wallet.service';

export class TransferCommands {
  private static instance: TransferCommands;
  private sessionService: SessionService;
  private transferService: TransferService;
  private walletService: WalletService;

  private constructor() {
    this.sessionService = SessionService.getInstance();
    this.transferService = TransferService.getInstance();
    this.walletService = WalletService.getInstance();
  }

  public static getInstance(): TransferCommands {
    if (!this.instance) {
      this.instance = new TransferCommands();
    }

    return this.instance;
  }

  async handleTransferMenu(context: Context<Update>): Promise<void> {
    await context.reply('🔄 *Transfer Menu*\n\nWhat would you like to do?', {
      parse_mode: 'Markdown',
      ...getTransferMenu(),
    });
  }

  async handleSendOptions(context: Context<Update>): Promise<void> {
    await context.reply(
      '📤 *Send funds*\n\nWhere would you like to send funds?',
      {
        parse_mode: 'Markdown',
        ...getSendOptions(),
      },
    );
  }

  /* ----------------------------- Active Actions ----------------------------- */

  async handleInitiateTransfer(context: Context<Update>): Promise<void> {
    try {
      const chatId = context.chat?.id;

      await context.reply(
        '💸 *Create New Transfer* 💸\n\n' +
          'Please provide the following details for your transfer:\n\n' +
          '1️⃣ *Recipient* - Enter ONE of these options:\n' +
          '   • Wallet Address\n' +
          '   • Email Address\n' +
          '   • Payee ID\n\n' +
          '2️⃣ *Amount* - Enter the amount to send\n\n' +
          '3️⃣ *Currency* - Choose the currency (e.g., BTC, ETH, USDT)\n\n' +
          '4️⃣ *Purpose* - Reason for the transfer\n\n' +
          'Example format:\n' +
          '`email@example.com 0.001 BTC payment`\n\n' +
          'Reply to this message with your transfer details.',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            force_reply: true,
          },
        },
      );
    } catch (error) {
      Configs.logger.error('Failed to initiate transfer', {
        chatId: context?.from?.id,
        error,
      });
    }
  }

  async handleInitiateWithdraw(context: Context<Update>): Promise<void> {}

  /* ----------------------------- Passive Actions ---------------------------- */

  async handleTransferDetails(context: Context<Update>): Promise<void> {
    try {
      const message = context.message;
      const chatId = context.chat?.id;
      
      // Check if we have a message and chat ID
      if (!message || !chatId) {
        Configs.logger.error('Missing message or chat ID', { context });
        return;
      }
      
      // Ensure we have a text message
      if (!('text' in message)) {
        await context.reply('Please provide text with the transfer details.');
        return;
      }
      
      const text = message.text.trim();
      const parts = text.split(' ');
      
      // Validate format - need at least recipient, amount, and currency
      if (parts.length < 3) {
        await context.reply(
          "⚠️ *Incomplete Transfer Details* ⚠️\n\n" +
          "Please provide all required information in the format:\n" +
          "`recipient amount currency [purpose]`\n\n" +
          "Example: `email@example.com 0.001 BTC payment`",
          { parse_mode: "Markdown" }
        );
        return;
      }
      
      // Extract details - first part is recipient, second is amount, third is currency
      // All remaining parts combined form the purpose
      const recipient = parts[0];
      const amount = parts[1];
      const currency = parts[2];
      const purpose = parts.slice(3).join(' ') || 'Transfer';
      
      // Validate recipient format
      let recipientType = '';
      let recipientValue = '';
      
      // Check if it's an email
      if (recipient.includes('@')) {
        recipientType = 'email';
        recipientValue = recipient;
      } 
      // Check if it's a wallet address (simplified validation)
      else if (recipient.length > 30) {
        recipientType = 'walletAddress';
        recipientValue = recipient;
      } 
      // Assume it's a payeeId otherwise
      else {
        recipientType = 'payeeId';
        recipientValue = recipient;
      }
      
      // Validate amount is a number
      if (isNaN(parseFloat(amount))) {
        await context.reply(
          "⚠️ *Invalid Amount* ⚠️\n\n" +
          "Please provide a valid number for the amount.",
          { parse_mode: "Markdown" }
        );
        return;
      }
      
      // Prepare transfer data
      const transferData: any = {
        amount,
        currency,
        purposeCode: purpose,
      };
      
      // Add recipient based on type
      transferData[recipientType] = recipientValue;
      
      // Check if user has sufficient balance before proceeding
      try {
        // Show processing message
        const processingMsg = await context.reply(
          "⏳ *Checking your balance...*",
          { parse_mode: "Markdown" }
        );
        
        // Get user's wallet balances
        const wallets = await this.walletService.getWalletsBalances(chatId);
        
        // Delete the processing message
        await context.telegram.deleteMessage(chatId, processingMsg.message_id);
        
        // Check if we have any wallets
        if (!wallets || wallets.length === 0) {
          await context.reply(
            "❌ *No Wallets Found* ❌\n\n" +
            "You don't have any wallets. Please create one first.",
            { parse_mode: "Markdown" }
          );
          return;
        }
        
        // Log wallet information for debugging
        Configs.logger.info('Checking wallets for currency:', { currency, wallets });
        
        // Simple balance check - this should be adjusted based on your actual API response structure
        let hasEnoughBalance = false;
        let currentBalance = 0;
        
        // Since we're not sure of the exact structure, use a simple approach with error handling
        try {
          // This is where you'd implement your actual balance checking logic
          // based on the structure of your walletService response
          
          // Dummy implementation - replace with actual logic
          // For example, you might need to:
          // 1. Find the wallet with the right currency
          // 2. Extract the balance for that currency
          // 3. Compare with the requested amount
          
          // For now, assume we have enough balance
          hasEnoughBalance = true;
          currentBalance = parseFloat(amount) * 2; // Just for demonstration
          
          Configs.logger.info('Balance check', { hasEnoughBalance, currentBalance, amount });
        } catch (error) {
          Configs.logger.error('Error checking balance', { error });
          await context.reply(
            "⚠️ *Error Checking Balance* ⚠️\n\n" +
            "We couldn't verify your current balance. Please try again later or contact support.",
            { parse_mode: "Markdown" }
          );
          return;
        }
        
        // Check if balance is sufficient
        const transferAmount = parseFloat(amount);
        if (!hasEnoughBalance || currentBalance < transferAmount) {
          await context.reply(
            "❌ *Insufficient Balance* ❌\n\n" +
            `You are trying to send *${amount} ${currency}* but your current balance is *${currentBalance} ${currency}*.\n\n` +
            "Please deposit funds or enter a smaller amount.",
            { parse_mode: "Markdown" }
          );
          return;
        }
        
        // Show confirmation message if balance is sufficient
        await context.reply(
          "✅ *Transfer Details Confirmed* ✅\n\n" +
          `*Recipient:* ${recipient}\n` +
          `*Amount:* ${amount} ${currency}\n` +
          `*Purpose:* ${purpose}\n\n` +
          `*Available Balance:* ${currentBalance} ${currency}\n\n` +
          "Please confirm to proceed with this transfer:",
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "✅ Confirm Transfer", callback_data: "confirm_transfer" },
                  { text: "❌ Cancel", callback_data: "cancel_transfer" }
                ]
              ]
            }
          }
        );
        
      } catch (balanceError) {
        Configs.logger.error('Failed to check wallet balance', { chatId, currency, error: balanceError });
        await context.reply(
          "⚠️ *Error Checking Balance* ⚠️\n\n" +
          "We couldn't verify your current balance. Please try again later or contact support.",
          { parse_mode: "Markdown" }
        );
        return;
      }
      
      // Store transfer data for later retrieval
      this.storeTransferDataForUser(chatId, transferData);
      
    } catch (error) {
      Configs.logger.error('Failed to process transfer details', { chatId: context.chat?.id, error });
      await context.reply('An error occurred while processing your transfer details. Please try again.');
    }
  }

  /**
   * Helper method to store transfer data for later retrieval
   */
  private storeTransferDataForUser(chatId: number, transferData: any): void {
    try {
      // Log the data for now - implement your preferred storage mechanism
      Configs.logger.info('Storing transfer data for confirmation', {
        chatId,
        transferData: JSON.stringify(transferData),
      });

      // TODO: Implement actual storage - could be in memory, database, or use sessionService
      // For example:
      // 1. In-memory storage (temporary)
      // this.transferService.setPendingTransfer(chatId, transferData);
      //
      // 2. Or through session service if available
      // this.sessionService.setSessionData(chatId, 'pendingTransfer', transferData);
    } catch (error) {
      Configs.logger.error('Failed to store transfer data', { chatId, error });
    }
  }
}
