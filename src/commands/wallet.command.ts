import { Context } from 'telegraf';
import { Message, Update } from 'telegraf/types';
import createDebug from 'debug';
import { WalletService } from '../api/services/wallet.service';
import { AuthService } from '../api/services/auth.service';
import * as Types from '../api/types';
import { escapeMarkdownV2, upperFirstCase } from '../api/utils/conversion';
import { getWalletInfoMenu, getWalletMenu } from '../menus/wallet.menu';

const debug = createDebug('bot:wallet-commands');

export class WalletCommands {
  private static instance: WalletCommands;
  private walletService: WalletService;
  private authService: AuthService;

  private constructor() {
    this.walletService = WalletService.getInstance();
    this.authService = AuthService.getInstance();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new WalletCommands();
    }
    return this.instance;
  }

  /* ----------------------------- Active Actions ---------------------------- */

  async handleWalletInfo(context: Context<Update>) {
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

      await context.editMessageText('🔍 Fetching your wallets...');

      const wallets = await this.walletService.getWallets(chatId);
      if (!wallets.length) {
        // await context.telegram.editMessageText(
        //   chatId,
        //   replyMessage.message_id,
        //   undefined,
        //   '💼 *No Wallets Found* 💼\n\n' +
        //     "You don't have any wallets registered with us yet.\n\n" +
        //     '➕ Use the /addwallet command to add a new wallet.\n' +
        //     '❓ Need help? Use /help to see all available commands.',
        //   { parse_mode: 'Markdown' },
        // );
        await context.reply(
          '💼 *No Wallets Found* 💼\n\n' +
            "You don't have any wallets registered with us yet.\n\n" +
            '➕ Use the /addwallet command to add a new wallet.\n' +
            '❓ Need help? Use /help to see all available commands.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      let walletMessage = '💰 *Your Registered Wallets* 💰\n\n';

      wallets.forEach((wallet, index) => {
        walletMessage += `*Wallet #${index + 1}*\n`;
        walletMessage += `🪪 *WalletId*: \`${wallet.id}\`\n`;
        walletMessage += `🫶🏻 *Default*: \`${wallet.isDefault ? '✅' : '❎'}\`\n`;
        walletMessage += `🔑 *Address*: \`${wallet.walletAddress}\`\n`;
        walletMessage += `🏢 *Organization*: ${wallet.organizationId}\n`;
        walletMessage += `📋 *Type*: ${escapeMarkdownV2(upperFirstCase(wallet.walletType))}\n`;
        if (wallet.network) {
          walletMessage += `📝 *Network*: ${escapeMarkdownV2(wallet.network!!)}\n`;
        }
        walletMessage += '\n';
      });
      await context.editMessageText(walletMessage, {
        parse_mode: 'Markdown',
        ...getWalletInfoMenu(),
      });
    } catch (error) {
      await context.reply(
        'Failed to get wallet information. Please try again.',
      );
    }
  }

  async handleIntializeGeneratingWallet(context: Context<Update>) {
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

      await context.reply(
        '🌐 *Input Your Wallet Network* 🌐\n\n' +
          '🔐 Your new wallet will be securely generated and linked to your account.',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            force_reply: true,
          },
        },
      );
    } catch (error) {
      debug('Error initializing generating wallet', { error });
      await context.reply(
        '❌ *Failed to Initialize Wallet Generation* ❌\n\n' +
          '🔴 Something went wrong while setting up your wallet creation process.\n\n' +
          '💡 *Suggestions*:\n' +
          '• Try again in a few moments\n' +
          '• Check your internet connection\n' +
          '• Contact support if the issue persists\n\n' +
          '🔄 Use /wallet command to try again.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleDefaultWallet(context: Context<Update>) {
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

      const defaultWallet = await this.walletService.getDefaultWallet(chatId);

      if (!defaultWallet) {
        await context.reply(
          '💼 *No Default Wallet Found* 💼\n\n' +
            "You don't have a default wallet registered with us yet.\n\n" +
            '➕ Use the /addwallet command to add a new wallet.\n' +
            '❓ Need help? Use /help to see all available commands.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      await context.reply(
        '💼 *Default Wallet* 💼\n\n' +
          '🔑 *Address*: `' +
          defaultWallet.walletAddress +
          '`\n' +
          '🏢 *Organization*: ' +
          defaultWallet.organizationId +
          '\n' +
          '📋 *Type*: ' +
          escapeMarkdownV2(upperFirstCase(defaultWallet.walletType)) +
          '\n' +
          '📝 *Network*: ' +
          escapeMarkdownV2(defaultWallet.network!!),
        { parse_mode: 'Markdown' },
      );
    } catch (error) {
      debug('Error getting default wallet', { error });
      await context.reply(
        '❌ *Failed to Get Default Wallet* ❌\n\n' +
          '🔴 Something went wrong while fetching your default wallet.\n\n' +
          '💡 *Suggestions*:\n' +
          '• Try again in a few moments\n' +
          '• Check your internet connection\n' +
          '• Contact support if the issue persists\n\n' +
          '🔄 Use /wallet command to try again.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleBalances(context: Context<Update>) {
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

      const replyMessage = await context.reply(
        '🔍 Fetching your wallet balances...',
      );

      const wallets = await this.walletService.getWalletsBalances(chatId);

      if (wallets.length == 0) {
        await context.telegram.editMessageText(
          chatId,
          replyMessage.message_id,
          undefined,
          '💼 *No Wallets Found* 💼\n\n' +
            "You don't have any wallets registered with us yet.\n\n" +
            '➕ Use the /addwallet command to add a new wallet.\n' +
            '❓ Need help? Use /help to see all available commands.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      let balanceMessage = '💰 *Your Wallet Balances* 💰\n\n';

      wallets.forEach((wallet, index) => {
        balanceMessage += `🌟 *Wallet \\#${escapeMarkdownV2(wallet.walletId)}* 🌟\n`;
        balanceMessage += `🔑 Default: \`${wallet.network ? '✅' : '❎'}\`\n`;
        if (wallet.balances && wallet.balances.length > 0) {
          balanceMessage += `🌲 *Balances*:\n`;
          wallet.balances.forEach((balance, i) => {
            const isLast = i === wallet.balances.length - 1;
            const prefix = isLast ? '└─🪙 ' : '├─🪙 ';

            // Currency and amount with symbol
            balanceMessage += `  ${prefix}${escapeMarkdownV2(balance.symbol)}: *${escapeMarkdownV2(balance.balance || '0')}*`;

            // Show decimals info
            if (balance.decimals !== undefined) {
              balanceMessage += ` \\(${escapeMarkdownV2(balance.decimals.toString())} decimals\\)`;
            }
            balanceMessage += `\n`;

            // Address with indentation
            if (balance.address) {
              const addressPrefix = isLast ? '  └─📍 ' : '  │ 📍 ';
              balanceMessage += `  ${addressPrefix}Address: \`${escapeMarkdownV2(balance.address)}\`\n`;

              // Add spacing after the last item of each balance
              if (isLast) balanceMessage += '';
              else balanceMessage += '  │\n';
            }
          });
        } else {
          balanceMessage += `💲 Balance: 0\n`;
        }
        balanceMessage += `🌐 Network: ${escapeMarkdownV2(wallet.network || 'Unknown')}\n`;
        balanceMessage += `${index < wallets.length - 1 ? '\n📊 ─────────────────── 📊\n\n' : ''}`;
      });

      await context.telegram.editMessageText(
        chatId,
        replyMessage.message_id,
        undefined,
        balanceMessage,
        { parse_mode: 'MarkdownV2' },
      );
    } catch (error) {
      debug('Error getting default wallet', { error });
      await context.reply(
        '❌ *Failed to Get Wallet Balances* ❌\n\n' +
          '🔴 Something went wrong while fetching your default wallet.\n\n' +
          '💡 *Suggestions*:\n' +
          '• Try again in a few moments\n' +
          '• Check your internet connection\n' +
          '• Contact support if the issue persists\n\n' +
          '🔄 Use /wallet command to try again.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleInitializeBalanceToken(context: Context<Update>) {
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

      await context.reply(
        '🌐 *Input Network and Token* 🌐\n\n' +
          '🔍 Please provide the network and token symbol: \n\n' +
          '💫 Example format: `123 usdc`\n' +
          '🔢 Where *123* is network ID\n' +
          '💱 And *USDC* is token symbol\n\n' +
          '💰 Your token balance will be securely fetched and displayed to you.',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            force_reply: true,
            input_field_placeholder: 'Example: 123 usdc',
          },
        },
      );
    } catch (error) {
      debug('Error initializing generating wallet', { error });
      await context.reply(
        '❌ *Failed to Fetch Token Balance* ❌\n\n' +
          '🔴 Something went wrong while setting up your wallet creation process.\n\n' +
          '💡 *Suggestions*:\n' +
          '• Try again in a few moments\n' +
          '• Check your internet connection\n' +
          '• Contact support if the issue persists\n\n' +
          '🔄 Use /wallet command to try again.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleInitializeSetDefaultWallet(context: Context<Update>) {
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

      await context.reply(
        '🌐 *Set Default Wallet* 🌐\n\n' +
          '🔑 Please select a wallet from the list below to set as default:',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            force_reply: true,
          },
        },
      );
    } catch (error) {
      debug('Error setting default wallet', { error });
      await context.reply(
        '❌ *Failed to Set Wallet Default* ❌\n\n' +
          '🔴 Something went wrong while fetching your default wallet.\n\n' +
          '💡 *Suggestions*:\n' +
          '• Try again in a few moments\n' +
          '• Check your internet connection\n' +
          '• Contact support if the issue persists\n\n' +
          '🔄 Use /wallet command to try again.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleTransactionHistory(context: Context<Update>) {
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

      const transactions =
        await this.walletService.getTransactionsHistory(chatId);

      if (transactions.length == 0) {
        await context.reply(
          '📜 *Transaction History* 📜\n\n' +
            "You don't have any transactions yet.\n\n" +
            '🔄 Use the /send command to send funds to another user.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      let message = '📜 *Transaction History* 📜\n\n';

      transactions.forEach((tx, index) => {
        // Transaction header with date
        const date = new Date(tx.createdAt || '').toLocaleString();
        message += `*Transaction \\#${index + 1}* (${escapeMarkdownV2(date)})\n`;

        // Type and status
        message += `📋 *Type*: ${escapeMarkdownV2(tx.type || 'Unknown')}\n`;
        message += `🔄 *Status*: ${escapeMarkdownV2(tx.status || 'Unknown')}\n`;

        // Amount and currency
        if (tx.amount) {
          message += `💰 *Amount*: ${escapeMarkdownV2(tx.amount)} ${escapeMarkdownV2(tx.currency || '')}\n`;
        }

        // Source and destination countries
        message += `🌍 *From Country*: ${escapeMarkdownV2(tx.sourceCountry || '')}\n`;
        message += `🌎 *To Country*: ${escapeMarkdownV2(tx.destinationCountry || '')}\n`;

        // Transaction details
        if (tx.invoiceNumber) {
          message += `🧾 *Invoice*: \`${escapeMarkdownV2(tx.invoiceNumber)}\`\n`;
        }

        // Source account details
        if (tx.sourceAccount) {
          message += `📤 *From*: `;
          if (tx.sourceAccount.type) {
            message += `${escapeMarkdownV2(tx.sourceAccount.type)} `;
          }

          if (tx.sourceAccount.accountId) {
            message += `\`${escapeMarkdownV2(tx.sourceAccount.accountId)}\` `;
          } else if (tx.sourceAccount.walletAddress) {
            message += `\`${escapeMarkdownV2(tx.sourceAccount.walletAddress)}\` `;
          } else if (tx.sourceAccount.bankAccountNumber) {
            message += `\`${escapeMarkdownV2(tx.sourceAccount.bankAccountNumber)}\` `;
          }

          if (tx.sourceAccount.bankName) {
            message += `at ${escapeMarkdownV2(tx.sourceAccount.bankName)}`;
          }
          message += `\n`;
        }

        // Destination account details
        if (tx.destinationAccount) {
          message += `📥 *To*: `;
          if (tx.destinationAccount.type) {
            message += `${escapeMarkdownV2(tx.destinationAccount.type)} `;
          }

          if (tx.destinationAccount.accountId) {
            message += `\`${escapeMarkdownV2(tx.destinationAccount.accountId)}\` `;
          } else if (tx.destinationAccount.walletAddress) {
            message += `\`${escapeMarkdownV2(tx.destinationAccount.walletAddress)}\` `;
          } else if (tx.destinationAccount.bankAccountNumber) {
            message += `\`${escapeMarkdownV2(tx.destinationAccount.bankAccountNumber)}\` `;
          }

          if (tx.destinationAccount.bankName) {
            message += `at ${escapeMarkdownV2(tx.destinationAccount.bankName)}`;
          }
          message += `\n`;
        }

        // Add sender name if available
        if (tx.senderDisplayName) {
          message += `👤 *Sender*: ${escapeMarkdownV2(tx.senderDisplayName)}\n`;
        }

        // Add note if available
        if (tx.note) {
          message += `📝 *Note*: ${escapeMarkdownV2(tx.note)}\n`;
        }

        // Add separator between transactions
        if (index < transactions.length - 1) {
          message += '\n-------------------\n\n';
        }
      });

      await context.reply(message, { parse_mode: 'MarkdownV2' });
    } catch (error) {
      debug('Error getting transaction history', { error });
      await context.reply(
        '❌ *Failed to Get Transaction History* ❌\n\n' +
          '🔴 Something went wrong while fetching your default wallet.\n\n' +
          '💡 *Suggestions*:\n' +
          '• Try again in a few moments\n' +
          '• Check your internet connection\n' +
          '• Contact support if the issue persists\n\n' +
          '🔄 Use /wallet command to try again.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  /* ----------------------------- Passive Actions ---------------------------- */

  async handleWalletMenu(context: Context<Update>) {
    await context.reply('💰 *Wallet Menu* 💰\n\nWhat would you like to do?', {
      parse_mode: 'Markdown',
      ...getWalletMenu(),
    });
  }

  async handleGenerateOrGetExisting(context: Context<Update>) {
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
      const message = context.message as Message.TextMessage;
      const reply_message = await context.reply('🔍 Generating wallet...');
      const input: Types.GenerateWalletDto = {
        network: message.text,
      };

      const wallet = await this.walletService.generateOrGetExisting(
        chatId,
        input,
      );

      if (!wallet) {
        await context.telegram.editMessageText(
          chatId,
          reply_message.message_id,
          undefined,
          '❌ *Failed to Generate Wallet* ❌\n\n' +
            '🔴 Something went wrong while generating your wallet.\n\n' +
            '💡 *Suggestions*:\n' +
            '• Try again in a few moments\n' +
            '• Check your internet connection\n' +
            '• Contact support if the issue persists\n\n' +
            '🔄 Use /wallet command to try again.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      await context.telegram.editMessageText(
        chatId,
        reply_message.message_id,
        undefined,
        '✅ *Wallet Generated* ✅\n\n' +
          '🔐 Your new wallet has been successfully created and linked to your account.\n\n' +
          '📝 *Wallet Address*: `' +
          wallet.walletAddress +
          '`',
        { parse_mode: 'Markdown' },
      );
    } catch (error) {
      debug('Error generating wallet', { error });
      await context.reply(
        '❌ *Failed to Generate Wallet* ❌\n\n' +
          '🔴 Something went wrong while generating your wallet.\n\n' +
          '💡 *Suggestions*:\n' +
          '• Try again in a few moments\n' +
          '• Check your internet connection\n' +
          '• Contact support if the issue persists\n\n' +
          '🔄 Use /wallet command to try again.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleBalanceToken(context: Context<Update>) {
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

      const replyMessage = await context.reply(
        '🔍 Fetching your wallet balances (default wallet)...',
      );

      const message = context.message as Message.TextMessage;

      const networkId = message.text.split(' ')[0];
      const tokenSymbol = message.text.split(' ')[1].toUpperCase();

      const balance = await this.walletService.getTokenBalance(
        chatId,
        networkId,
        tokenSymbol,
      );

      let balanceMessage = `💰 *Token Balance for ${escapeMarkdownV2(tokenSymbol.toUpperCase())}* 💰\n\n`;

      if (!balance) {
        balanceMessage += `❌ *No balance found* for ${escapeMarkdownV2(tokenSymbol.toUpperCase())} on network ${escapeMarkdownV2(networkId)}.\n\n`;
        balanceMessage += `💡 *Possible reasons*:\n`;
        balanceMessage += `• You don't own this token\n`;
        balanceMessage += `• The network ID or token symbol is incorrect\n`;
        balanceMessage += `• There might be connectivity issues with the blockchain\n`;
      } else {
        // Token details
        balanceMessage += `🪙 *${escapeMarkdownV2(tokenSymbol.toUpperCase())}*: ${escapeMarkdownV2(balance.balance || '0')}\n`;

        // Show decimals info if available
        if (balance.decimals !== undefined) {
          balanceMessage += `📊 *Decimals*: ${escapeMarkdownV2(balance.decimals.toString())}\n`;
        }

        // Show address if available
        if (balance.address) {
          balanceMessage += `📍 *Contract*: \`${escapeMarkdownV2(balance.address)}\`\n`;
        }

        // Network information
        balanceMessage += `🌐 *Network*: ${escapeMarkdownV2(networkId)}\n`;
      }

      // Add helpful tip at the end
      balanceMessage += `\n💡 *Tip*: Check other tokens with the same format: \`<network> <token>\``;

      await context.telegram.editMessageText(
        chatId,
        replyMessage.message_id,
        undefined,
        balanceMessage,
        { parse_mode: 'MarkdownV2' },
      );
    } catch (error) {
      debug('Error getting default wallet', { error });
      await context.reply(
        '❌ *Failed to Get Token Balance* ❌\n\n' +
          '🔴 Something went wrong while fetching your default wallet.\n\n' +
          '💡 *Suggestions*:\n' +
          '• Try again in a few moments\n' +
          '• Check your internet connection\n' +
          '• Contact support if the issue persists\n\n' +
          '🔄 Use /wallet command to try again.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleSetDefaultWallet(context: Context<Update>) {
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

      const replyMessage = await context.reply(
        '⚙️ Setting your defaul wallet...',
      );

      const message = context.message as Message.TextMessage;

      const input: Types.SetDefaultWalletDto = {
        walletId: message.text,
      };

      const setDefaultWallet = await this.walletService.setDefaultWallet(
        chatId,
        input,
      );

      if (!setDefaultWallet) {
        await context.telegram.editMessageText(
          chatId,
          replyMessage.message_id,
          undefined,
          '❌ *Failed to Set Default Wallet* ❌\n\n' +
            '🔴 Something went wrong while setting your default wallet.\n\n' +
            '💡 *Suggestions*:\n' +
            '• Try again in a few moments\n' +
            '• Check your internet connection\n' +
            '• Contact support if the issue persists\n\n' +
            '🔄 Use /wallet command to try again.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      await context.telegram.editMessageText(
        chatId,
        replyMessage.message_id,
        undefined,
        '✅ *Default Wallet Set* ✅\n\n' +
          '🔑 Wallet ' +
          escapeMarkdownV2(setDefaultWallet.id) +
          ' has been set as your default wallet.',
        { parse_mode: 'Markdown' },
      );
    } catch (error) {
      debug('Error setting default wallet', { error });
      await context.reply(
        '❌ *Failed to Set Wallet Default* ❌\n\n' +
          '🔴 Something went wrong while fetching your default wallet.\n\n' +
          '💡 *Suggestions*:\n' +
          '• Try again in a few moments\n' +
          '• Check your internet connection\n' +
          '• Contact support if the issue persists\n\n' +
          '🔄 Use /wallet command to try again.',
        { parse_mode: 'Markdown' },
      );
    }
  }
}
