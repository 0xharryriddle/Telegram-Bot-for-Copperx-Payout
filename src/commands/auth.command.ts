import { escapeMarkdownV2, upperFirstCase } from './../api/utils/conversion';
import { Context } from 'telegraf';
import { Message, Update } from 'telegraf/types';

import { AuthService } from '../api/services/auth.service';
import { validateOtp } from '../api/utils/validation';
import { SessionService } from '../api/services/session.service';
import * as Types from '../api/types';

const debug = require('debug')('bot:auth-command');

export class AuthCommands {
  private static instance: AuthCommands;
  private authService: AuthService;
  private sessionService: SessionService;

  private constructor() {
    this.authService = AuthService.getInstance();
    this.sessionService = SessionService.getInstance();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AuthCommands();
    }
    return this.instance;
  }

  /* ----------------------------- Active Actions ----------------------------- */

  async handleLogin(context: Context<Update>) {
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
      const isAuthenticated = await this.authService.isAuthenticated(chatId);
      if (isAuthenticated) {
        await context.reply(
          '✅ *You are already logged in!* ✅\n\n' +
            'It seems like you are already authenticated and ready to use the bot.\n\n' +
            '💡 *Tip*: Use the available commands to explore features or type /help for assistance.',
          { parse_mode: 'Markdown' },
        );
        return;
      }
      await context.reply(
        '📧 *Email Verification Required* 📧\n\n' +
          'To proceed with login, please provide your email address. We will send you a secure OTP code to verify your identity.\n\n' +
          '💡 *Tip*: Ensure you enter the correct email address associated with your account.',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            force_reply: true,
          },
        },
      );
    } catch (error) {
      debug('Failed to handle login.', error);
      await context.reply(
        '⚠️ *Login Failed* ⚠️\n\n' +
          'We encountered an issue while trying to log you in.\n\n' +
          'Please try again or contact support if the problem persists.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleLogout(context: Context<Update>) {
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
      const userSession = await this.sessionService.getSession(chatId);
      if (userSession.state === Types.UserState.IDLE) {
        await context.reply(
          '⚠️ *Logout Unsuccessful* ⚠️\n\n' +
            'It seems like you are not currently logged in.\n\n' +
            'To access your account, please use the /login command.',
          { parse_mode: 'Markdown' },
        );
        return;
      }
      await this.authService.logout(chatId);
      await context.reply(
        '🚪 *Logout Successful* 🚪\n\n' +
          'You have been securely logged out of your account.\n\n' +
          'We hope to see you again soon! If you wish to log back in, simply use the /login command.',
        { parse_mode: 'Markdown' },
      );
    } catch (error) {
      debug('Failed to handle logout.', error);
      await context.reply(
        '⚠️ *Logout Failed* ⚠️\n\n' +
          'We encountered an issue while trying to log you out.\n\n' +
          'Please try again or contact support if the problem persists.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleUserProfile(context: Context<Update>) {
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
      const userProfile = await this.authService.userProfile(chatId);
      if (!userProfile) {
        await context.reply(
          '⚠️ *User Identification Failed* ⚠️\n\n' +
            'We were unable to identify your user account.\n\n' +
            '💡 *Tip*: Please ensure you are interacting with the bot from a valid chat session.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      await context.sendMessage(
        `🟢 *USER PROFILE* 🟢\n\n` +
          `👤 *Personal Details*\n` +
          `├─ *Name*: ${escapeMarkdownV2(userProfile.firstName!!) || 'N/A'} ${escapeMarkdownV2(userProfile.lastName!!) || 'N/A'}\n` +
          `├─ *Email*: ${escapeMarkdownV2(userProfile.email!!) || 'N/A'}\n` +
          `├─ *Role*: ${escapeMarkdownV2(upperFirstCase(userProfile.role))}\n` +
          `└─ *Status*: ${escapeMarkdownV2(upperFirstCase(userProfile.status))}\n\n` +
          `💰 *Wallet Information*\n` +
          `├─ *Account Type*: ${escapeMarkdownV2(upperFirstCase(userProfile.walletAccountType!!)) || 'N/A'}\n` +
          `├─ *Wallet Address*: ${escapeMarkdownV2(userProfile.walletAddress!!) || 'N/A'}\n` +
          `└─ *Relayer Address*: ${escapeMarkdownV2(userProfile.relayerAddress) || 'N/A'}\n\n` +
          `🔒 *Verification*\n` +
          `└─ *KYC Status*: ${escapeMarkdownV2(upperFirstCase(userProfile.status))}\n\n` +
          `🏢 *Organization*\n` +
          `└─ *ID*: ${escapeMarkdownV2(userProfile.organizationId!!) || 'N/A'}\n\n` +
          `🏷️ *Flags*: ${escapeMarkdownV2(upperFirstCase(userProfile.flags?.join(', ')!!)) || 'None'}\n\n` +
          `🖼️ *Profile Image*: ${
            userProfile.profileImage
              ? `[View Image](${escapeMarkdownV2(userProfile.profileImage)})`
              : 'N/A'
          }`,
        { parse_mode: 'MarkdownV2' },
      );
    } catch (error) {
      debug('Failed to handle user profile.', error);
      await context.reply(
        '⚠️ *User Profile Error* ⚠️\n\n' +
          'We encountered an issue while trying to fetch your user profile.\n\n' +
          'Please try again or contact support if the problem persists.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  /* ----------------------------- Passive Actions ---------------------------- */

  async handleInitializeLogin(context: Context<Update>) {
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
      const isAuthenticated = await this.authService.isAuthenticated(chatId);
      if (isAuthenticated) {
        await context.reply(
          '✅ *You are already logged in!* ✅\n\n' +
            'It seems like you are already authenticated and ready to use the bot.\n\n' +
            '💡 *Tip*: Use the available commands to explore features or type /help for assistance.',
          { parse_mode: 'Markdown' },
        );
        return;
      }
      const input: Types.LoginEmailOtpRequestDto = {
        email: message.text,
      };
      await this.authService.initializeLogin(chatId, input, context);
    } catch (error) {
      debug('Failed to initialize login.', error);
      await context.reply(
        '⚠️ *Login Initialization Failed* ⚠️\n\n' +
          'We encountered an issue while trying to start your login process.\n\n' +
          '💡 *Tip*: Please ensure you have entered a valid email address and try again.\n\n' +
          'If the problem persists, feel free to contact our support team for assistance.',
        { parse_mode: 'Markdown' },
      );
    }
  }

  async handleVerifyOtp(context: Context<Update>) {
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
      const otp = message.text?.trim();
      if (!otp || !validateOtp(otp)) {
        await context.reply(
          '❌ *Invalid OTP Format* ❌\n\n' +
            'The OTP you entered is not valid. Please ensure it is a *6-digit code* sent to your email.\n\n' +
            '💡 *Tip*: Double-check the code and try again.',
          { parse_mode: 'Markdown' },
        );
        return;
      }

      await context.reply(
        '🔄 *Authentication in Progress* 🔄\n\n' +
          "We're verifying your credentials...\n\n" +
          'This will only take a moment. Please wait while we secure your session.',
        { parse_mode: 'Markdown' },
      );

      const userSession = await this.authService.verifyOtp(
        chatId,
        otp,
        context,
      );

      if (!userSession) {
        throw new Error('Invalid OTP');
      }

      if (userSession) {
        const kycStatus = await this.authService.checkKycStatus(chatId);
        const kycVerified =
          !!kycStatus && kycStatus.status === Types.KycStatus.approved;

        await this.sessionService.updateSession(chatId, {
          kycVerified: kycVerified,
        });

        if (kycVerified) {
          await context.reply(
            `✅ Login successful! Welcome, ${
              userSession.firstName || userSession.email
            }!\n\nAvailable commands:\n• /wallet - Check your wallet balance\n• /send - Send funds to another user\n• /logout - Logout from your account`,
          );
        } else {
          await context.reply(
            `✅ Login successful! Welcome, ${
              userSession.firstName || userSession.email
            }!\n\n⚠️ Your account KYC is not verified. Please complete your KYC verification to use all features.`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: 'Learn how to complete KYC - CopperX Blog',
                      url: 'https://copperx.io/blog/how-to-complete-your-kyc-and-kyb-at-copperx-payout',
                    },
                  ],
                  [
                    {
                      text: 'Complete KYC now - CopperX',
                      url: 'https://copperx.io',
                    },
                  ],
                ],
              },
            },
          );
        }
      }
    } catch (error) {
      debug('Failed to verify OTP.', error);
      await context.reply(
        '❌ *OTP Verification Failed* ❌\n\n' +
          'We were unable to verify the OTP you provided. Please ensure the code is correct and try again.\n\n' +
          '💡 *Tip*: Check your email for the latest OTP or request a new one if needed.',
        { parse_mode: 'Markdown' },
      );
    }
  }
}
