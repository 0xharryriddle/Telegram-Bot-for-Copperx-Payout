import * as Configs from '../configs/index';
import * as Types from '../api/types/index';
import { TransferService } from '../api/services/transfer.service';
import { SessionService } from '../api/services/session.service';
import { Context } from 'telegraf';
import { Message, Update } from 'telegraf/types';
import {
  getSendOptions,
  getTransferConfirmMenu,
  getTransferMenu,
} from '../menus/transfer.menu';
import { WalletService } from '../api/services/wallet.service';
import { validateEmail } from '../api/utils/validation';

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

  async handleInitiateWalletTransfer(context: Context<Update>): Promise<void> {
    try {
      await context.reply(
        '💸 *Create New Transfer* 💸\n\n' +
          'Please provide the following details for your transfer:\n\n' +
          '1️⃣ *Recipient* - Enter Wallet Address:\n' +
          '2️⃣ *Amount* - Enter the amount to send\n\n' +
          '3️⃣ *Currency* - Choose the currency (e.g., BTC, ETH, USDT)\n\n' +
          '4️⃣ *Purpose* - Reason for the transfer\n\n' +
          'Example format:\n' +
          '`0x37f333f49425d2eb853811b23465e65948dbbb70acec4f101ba1a41558d36f9 0.001 BTC payment`\n\n' +
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

  async handleInitiateEmailTransfer(context: Context<Update>): Promise<void> {
    try {
      await context.reply(
        '💸 *Create New Transfer* 💸\n\n' +
          'Please provide the following details for your transfer:\n\n' +
          '1️⃣ *Recipient* - Enter Email Address:\n\n' +
          '2️⃣ *Amount* - Enter the amount to send\n\n' +
          '3️⃣ *Currency* - Choose from:\n' +
          '   • Fiat: USD, EUR, GBP, AED, SGD, CAD, AUD, etc.\n' +
          '   • Crypto: USDC, USDT, ETH, DAI, STRK\n\n' +
          '4️⃣ *PurposeCode* - Choose from:\n' +
          '   `self`, `salary`, `gift`, `income`, `saving`, `education_support`,\n' +
          '   `family`, `home_improvement`, `reimbursement`\n\n' +
          'Example format:\n' +
          '`email@example.com 0.001 USDT gift`\n\n' +
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
      const chatId = context.chat?.id;

      if (!chatId) {
        await context.reply(
          '⚠️ *User Identification Failed* ⚠️\n\n' +
            'We were unable to identify your user account.\n\n' +
            '💡 *Tip*: Please ensure you are interacting with the bot from a valid chat session.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      const processingMsg = await context.reply('Loading transfer details...', {
        parse_mode: 'Markdown',
      });

      const userSession = await this.sessionService.getSession(chatId);

      const transferData = userSession.transferData;
      // Show processing message

      await context.telegram.editMessageText(
        chatId,
        processingMsg.message_id,
        '',
        '⏳ *Checking your balance...*',
        { parse_mode: 'Markdown' },
      );

      // Get user's wallet balances
      const defaultWallet = await this.walletService.getDefaultWallet(chatId);

      console.log('Default Wallet: ', defaultWallet);

      // Check if we have any wallets
      if (!defaultWallet) {
        await context.telegram.editMessageText(
          chatId,
          processingMsg.message_id,
          '',
          '❌ *No Wallets Found* ❌\n\n' +
            "You don't have any wallets. Please create one first.",
          { parse_mode: 'Markdown' },
        );
        return;
      }

      const transfer = await this.transferService.sendPayment(chatId, {
        amount: transferData?.amount!!,
        currency: transferData?.currency!!,
        purposeCode: transferData?.purposeCode!!,
        email: transferData?.email!!,
        walletAddress: transferData?.walletAddress!!,
        payeeId: defaultWallet.id,
      });

      if (!transfer) {
        await context.telegram.editMessageText(
          chatId,
          processingMsg.message_id,
          '',
          '❌ *Transfer Failed* ❌\n\n' +
            'We were unable to process your transfer. Please try again later.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      await context.telegram.editMessageText(
        chatId,
        processingMsg.message_id,
        '',
        '✅ *Transfer Details Confirmed* ✅\n\n' +
          `*Recipient:* ${transfer.destinationAccount?.id || 'Unknown'}\n` +
          `*Amount:* ${transfer.amount} ${transfer.currency}\n` +
          `*Status:* ${transfer.status}\n` +
          `*Type:* ${transfer.type || 'Standard'}\n` +
          `*From:* ${transfer.sourceCountry} → *To:* ${transfer.destinationCountry}\n` +
          (transfer.totalFee
            ? `*Fee:* ${transfer.totalFee} ${transfer.feeCurrency || transfer.currency}\n`
            : '') +
          (transfer.note ? `*Note:* ${transfer.note}\n` : '') +
          (transfer.senderDisplayName
            ? `*Sender:* ${transfer.senderDisplayName}\n`
            : '') +
          `*Purpose:* ${transfer.purposeCode || 'Not specified'}\n\n`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✅ Confirm Transfer',
                  callback_data: 'confirm_transfer',
                },
                { text: '❌ Cancel', callback_data: 'cancel_transfer' },
              ],
            ],
          },
        },
      );
    } catch (error) {
      console.error(error);
      Configs.logger.error('Failed to process transfer details', {
        chatId: context.chat?.id,
        error,
      });
      await context.reply(
        'An error occurred while processing your transfer details. Please try again.',
      );
    }
  }

  async handlePreEmailTransfer(context: Context<Update>): Promise<void> {
    const chatId = context.chat?.id;
    try {
      if (!chatId) {
        await context.reply(
          '⚠️ *User Identification Failed* ⚠️\n\n' +
            'We were unable to identify your user account.\n\n' +
            '💡 *Tip*: Please ensure you are interacting with the bot from a valid chat session.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      const userSession = await this.sessionService.getSession(chatId);

      const message = context.message as Message.TextMessage;
      const components = message.text.split(' ');
      if (components.length < 3) {
        await context.reply('', { parse_mode: 'Markdown' });
        return;
      }
      if (!validateEmail(components[0])) {
        await context.reply(
          '⚠️ *Invalid Email Address* ⚠️\n\n' +
            'Please provide a valid email address to proceed.',
          { parse_mode: 'Markdown' },
        );
        return;
      }
      if (components[1] === undefined || isNaN(parseFloat(components[1]))) {
        await context.reply(
          '⚠️ *Invalid Amount* ⚠️\n\n' +
            'Please provide a valid amount to proceed.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      // Check if the provided currency is valid
      const upperCaseCurrency = components[2].toUpperCase();
      if (
        !Object.values(Types.Currency).includes(
          upperCaseCurrency as Types.Currency,
        )
      ) {
        await context.reply(
          '⚠️ *Invalid Currency* ⚠️\n\n' +
            'Please provide a valid currency code from the supported list.\n\n' +
            'Examples: USD, EUR, GBP, USDT, ETH, etc.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      // Check if purpose code is provided and valid
      if (!components[3]) {
        await context.reply(
          '⚠️ *Missing Purpose Code* ⚠️\n\n' +
            'Please provide a valid purpose code from the supported list.\n\n' +
            'Examples: self, salary, gift, income, etc.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      // Check if the provided purpose code is valid
      const purposeCode = components[3].toLowerCase();
      if (
        !Object.values(Types.PurposeCode).includes(
          purposeCode as Types.PurposeCode,
        )
      ) {
        await context.reply(
          '⚠️ *Invalid Purpose Code* ⚠️\n\n' +
            'Please provide a valid purpose code from the supported list.\n\n' +
            'Valid codes: self, salary, gift, income, saving, education_support, family, home_improvement, reimbursement',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      await this.sessionService.updateSession(chatId, {
        ...userSession,
        state: Types.UserState.AWAITING_CONFIRMATION,
        transferData: {
          method: 'email',
          email: components[0],
          amount: components[1],
          currency: upperCaseCurrency as Types.Currency,
          purposeCode: purposeCode as Types.PurposeCode,
        },
      });

      // Create a confirmation message with details and emojis
      await context.reply(
        '🌟 *Email Transfer Confirmation* 🌟\n\n' +
          '📧 *Recipient:* ' +
          components[0] +
          '\n' +
          '💰 *Amount:* ' +
          components[1] +
          ' ' +
          upperCaseCurrency +
          '\n' +
          '🏷️ *Purpose:* ' +
          purposeCode +
          '\n\n' +
          '✅ Please confirm this transfer by selecting an option below:',
        {
          parse_mode: 'Markdown',
          ...getTransferConfirmMenu(),
        },
      );
    } catch (error) {
      Configs.logger.error('Failed to process email transfer request', {
        chatId,
        error,
      });
      await context.reply(
        '❌ *Error Processing Transfer Request* ❌\n\n' +
          '⚠️ Something went wrong while processing your email transfer.\n\n' +
          '📋 *Possible issues:*\n' +
          '• Invalid email format\n' +
          '• Incorrect currency code\n' +
          '• Server connection problems\n\n' +
          '🔄 Please try again or contact support if the issue persists.',
        {
          parse_mode: 'Markdown',
        },
      );
    }
  }

  async handleEmailTransfer(context: Context<Update>): Promise<void> {
    try {
      const chatId = context.chat?.id;
      console.log(context.message);
      await context.reply('Loading email transfer details...', {
        parse_mode: 'Markdown',
      });
    } catch (error) {}
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
