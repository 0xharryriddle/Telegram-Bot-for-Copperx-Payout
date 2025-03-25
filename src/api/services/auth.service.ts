import { Context } from 'telegraf';

import * as Configs from '../../configs/index';
import * as Types from '../../api/types/index';
import { CopperxPayoutService } from './copperxPayout.service';
import { SessionService } from './session.service';
import { Update } from 'telegraf/types';
import { NotificationService } from './notification.service';

export class AuthService {
  private static instance: AuthService;
  private copperxPayoutService: CopperxPayoutService;
  private notificationService: NotificationService;
  private sessionService = SessionService.getInstance();

  private constructor() {
    this.notificationService = NotificationService.getInstance();
    this.copperxPayoutService = new CopperxPayoutService();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return this.instance;
  }

  async initializeLogin(
    chatId: number,
    input: Types.LoginEmailOtpRequestDto,
    context: Context<Update>,
  ): Promise<boolean> {
    try {
      const response = await this.copperxPayoutService.requestEmailOtp(input);

      await this.sessionService.updateSession(chatId, {
        email: input.email,
        state: Types.UserState.AWAITING_OTP,
        authData: response,
      });

      await context.sendMessage(
        '🔐 *Enter your OTP Code* 🔐\n\n' +
          'Please enter the 6-digit verification code sent to your email.\n\n' +
          '⏱️ This code will expire shortly, so please enter it promptly.',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            force_reply: true,
          },
        },
      );

      return true;
    } catch (error) {
      Configs.logger.error('Error initializing login', { error });
      await this.sessionService.updateSession(chatId, {
        state: Types.UserState.IDLE,
      });
      return false;
    }
  }

  async verifyOtp(
    chatId: number,
    otp: string,
    context: Context<Update>,
  ): Promise<Types.AuthUserDto | null> {
    const session = await this.sessionService.getSession(chatId);
    try {
      if (!session.email || !session.authData?.sid) {
        await this.sessionService.updateSession(chatId, {
          state: Types.UserState.IDLE,
        });
        return null;
      }
      const input: Types.VerifyEmailOtpRequestDto = {
        email: session.email,
        otp,
        sid: session.authData.sid,
      };
      const response =
        await this.copperxPayoutService.emailOtpAuthenticate(input);
      await this.sessionService.updateSession(chatId, {
        state: Types.UserState.AUTHENTICATED,
        userId: response.user.id,
        organizationId: response.user.organizationId,
        authData: {
          accessToken: response.accessToken,
          accessTokenId: response.accessTokenId,
          expireAt: response.expireAt,
        },
      });
      await context.sendMessage(
        '🔒 *Authentication Successful* 🔒\n\n' +
          'Your identity has been verified and your session is now active.\n\n' +
          'You can now access all features of the CopperX Payout system.\n\n' +
          'Use /help to see available commands or check the menu below.',
        { parse_mode: 'Markdown' },
      );
      await this.notificationService.initializeClient(
        session.authData.accessToken!!,
        session.organizationId!!,
      );
      return response.user;
    } catch (error) {
      Configs.logger.error('Error verifying OTP', {
        error,
        email: session.email,
        chatId,
      });

      return null;
    }
  }

  async isAuthenticated(chatId: number): Promise<boolean> {
    try {
      const session = await this.sessionService.getSession(chatId);

      return (
        session.state === Types.UserState.AUTHENTICATED &&
        !!session.authData?.accessToken &&
        !!session.authData?.expireAt &&
        new Date(session.authData.expireAt) > new Date()
      );
    } catch (error) {
      Configs.logger.error('Error checking authentication', { error, chatId });
      return false;
    }
  }

  async isVerified(chatId: number): Promise<boolean> {
    try {
      const session = await this.sessionService.getSession(chatId);

      return !!session.kycVerified;
    } catch (error) {
      Configs.logger.error('Error checking KYC verification', {
        error,
        chatId,
      });
      return false;
    }
  }

  async isAuthenticatedAndVerified(chatId: number): Promise<boolean> {
    return (
      (await this.isAuthenticated(chatId)) && (await this.isVerified(chatId))
    );
  }

  async getAccessToken(chatId: number): Promise<string | null> {
    try {
      const session = await this.sessionService.getSession(chatId);

      if (
        session.state === Types.UserState.AUTHENTICATED &&
        session.authData?.accessToken
      ) {
        return session.authData.accessToken;
      }

      return null;
    } catch (error) {
      Configs.logger.error('Error getting access token', { error, chatId });
      return null;
    }
  }

  async logout(chatId: number): Promise<boolean> {
    const session = await this.sessionService.getSession(chatId);
    try {
      await this.sessionService.updateSession(chatId, {
        state: Types.UserState.IDLE,
        kycVerified: false,
        authData: undefined,
      });
      if (session.organizationId) {
        this.notificationService.unsubscribe(session.organizationId);
      }
      return true;
    } catch (error) {
      Configs.logger.error('Error logging out', { error, chatId });
      return false;
    }
  }

  async checkKycStatus(chatId: number): Promise<Types.KycDto | null> {
    const session = await this.sessionService.getSession(chatId);
    try {
      const accessToken = session.authData?.accessToken;

      if (!accessToken || !session.userId) {
        return null;
      }

      const kycStatus = await this.copperxPayoutService.getKycStatus(
        accessToken,
        1,
        1,
      );
      return kycStatus;
    } catch (error) {
      Configs.logger.error('Error checking KYC status', {
        error,
        chatId,
        userId: session.userId,
      });

      return null;
    }
  }

  async userProfile(chatId: number): Promise<Types.AuthUserDto | null> {
    try {
      const accessToken = await this.getAccessToken(chatId);

      if (!accessToken) {
        return null;
      }

      const user = await this.copperxPayoutService.authMe(accessToken);
      return user;
    } catch (error) {
      Configs.logger.error('Error getting user profile', { error, chatId });
      return null;
    }
  }
}
