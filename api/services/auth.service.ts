import { CopperxPayoutService } from './copperxPayout.service';
import * as Configs from '../../src/configs';
import { UserModel } from '../models/User.model';
import { UserEmailModel } from '../models/UserEmail.model';

export class AuthService {
  private copperxService: CopperxPayoutService;

  constructor() {
    this.copperxService = new CopperxPayoutService();
  }

  async emailOtpRequest(email: string, telegramId: number) {
    try {
      // Request OTP from Copperx Payout - this will validate if the email exists in their system
      const response = await this.copperxService.emailOtpRequest(email);
      
      if (!response) {
        return { success: false, message: 'Failed to request OTP' };
      }

      // Store temporary email information for OTP verification
      await UserEmailModel.findOneAndUpdate(
        { telegramId, email },
        { 
          telegramId,
          email,
          sid: response.sid,
          lastOtpRequestTime: new Date(),
          isAuthenticated: false,
          token: null
        },
        { upsert: true }
      );
      
      return { success: true, message: 'OTP sent to your email' };
    } catch (error) {
      Configs.logger.error('Failed to request OTP', { error, email, telegramId });
      return { success: false, message: 'Failed to request OTP' };
    }
  }

  async verifyOtp(telegramId: number, otp: string) {
    try {
      // Get user's email data
      const userEmail = await UserEmailModel.findOne({ 
        telegramId,
        lastOtpRequestTime: { $exists: true },
        sid: { $exists: true }
      }).sort({ lastOtpRequestTime: -1 });
      
      if (!userEmail || !userEmail.email || !userEmail.sid) {
        return { success: false, message: 'Please request OTP first' };
      }
      
      // Verify OTP with Copperx Payout
      const response = await this.copperxService.emailOtpAuthenticate(userEmail.email, otp, userEmail.sid);
      
      if (!response) {
        return { success: false, message: 'Invalid OTP' };
      }

      // Create user record only after successful OTP verification
      await UserModel.findOneAndUpdate(
        { telegramId },
        { telegramId },
        { upsert: true }
      );
      
      // Check if this is the first authenticated email for this user
      const authenticatedEmailCount = await UserEmailModel.countDocuments({
        telegramId,
        isAuthenticated: true
      });

      const isFirstAuthenticated = authenticatedEmailCount === 0;
      
      // Update the email authentication status
      await UserEmailModel.findOneAndUpdate(
        { telegramId, email: userEmail.email },
        { 
          token: response.token,
          isAuthenticated: true,
          lastLoginTime: new Date(),
          // Set as default if it's the first authenticated email
          isDefault: isFirstAuthenticated
        }
      );
      
      let message = 'Authentication successful';
      if (isFirstAuthenticated) {
        message = 'Authentication successful. This email has been set as your default email.';
      }
      
      return { 
        success: true, 
        message,
        token: response.token,
        email: userEmail.email
      };
    } catch (error) {
      Configs.logger.error('Failed to verify OTP', { error });
      return { success: false, message: 'Failed to verify OTP' };
    }
  }

  async getUserProfile(telegramId: number, email?: string) {
    try {
      // Get the specified email or default email
      const userEmail = await UserEmailModel.findOne(
        email 
          ? { telegramId, email }
          : { telegramId, isDefault: true }
      );
      
      if (!userEmail || !userEmail.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const profile = await this.copperxService.authMe(userEmail.token);
      
      if (!profile) {
        // Token might be expired
        await UserEmailModel.findOneAndUpdate(
          { telegramId, email: userEmail.email },
          { isAuthenticated: false, token: null }
        );
        return { success: false, message: 'Session expired, please login again' };
      }
      
      return { success: true, profile };
    } catch (error) {
      Configs.logger.error('Failed to get user profile', { error });
      return { success: false, message: 'Failed to get user profile' };
    }
  }

  async getKYCStatus(telegramId: number, email?: string) {
    try {
      const userEmail = await UserEmailModel.findOne(
        email 
          ? { telegramId, email }
          : { telegramId, isDefault: true }
      );
      
      if (!userEmail || !userEmail.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const kycStatus = await this.copperxService.getKYCStatus(userEmail.token);
      
      if (!kycStatus) {
        return { success: false, message: 'Failed to get KYC status' };
      }
      
      return { success: true, kycStatus };
    } catch (error) {
      Configs.logger.error('Failed to get KYC status', { error });
      return { success: false, message: 'Failed to get KYC status' };
    }
  }

  async reLogin(telegramId: number, email?: string) {
    try {
      const userEmail = await UserEmailModel.findOne(
        email 
          ? { telegramId, email }
          : { telegramId, isDefault: true }
      );
      
      if (!userEmail || !userEmail.email) {
        return { success: false, message: 'No previous login found' };
      }
      
      return await this.emailOtpRequest(userEmail.email, telegramId);
    } catch (error) {
      Configs.logger.error('Failed to re-login', { error });
      return { success: false, message: 'Failed to re-login' };
    }
  }

  async logout(telegramId: number, email?: string) {
    try {
      if (email) {
        // Logout specific email
        await UserEmailModel.findOneAndUpdate(
          { telegramId, email },
          { isAuthenticated: false, token: null }
        );
      } else {
        // Logout all emails
        await UserEmailModel.updateMany(
          { telegramId },
          { isAuthenticated: false, token: null }
        );
      }
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      Configs.logger.error('Failed to logout', { error });
      return { success: false, message: 'Failed to logout' };
    }
  }

  async listEmails(telegramId: number) {
    try {
      const emails = await UserEmailModel.find(
        { telegramId },
        { email: 1, isAuthenticated: 1, isDefault: 1, lastLoginTime: 1 }
      );
      
      return {
        success: true,
        emails: emails.map(e => ({
          email: e.email,
          isAuthenticated: e.isAuthenticated,
          isDefault: e.isDefault,
          lastLoginTime: e.lastLoginTime
        }))
      };
    } catch (error) {
      Configs.logger.error('Failed to list emails', { error });
      return { success: false, message: 'Failed to list emails' };
    }
  }

  async setDefaultEmail(telegramId: number, email: string) {
    try {
      const userEmail = await UserEmailModel.findOne({ telegramId, email });
      
      if (!userEmail) {
        return { success: false, message: 'Email not found' };
      }

      // Remove default flag from all other emails
      await UserEmailModel.updateMany(
        { telegramId },
        { isDefault: false }
      );

      // Set the specified email as default
      await UserEmailModel.findOneAndUpdate(
        { telegramId, email },
        { isDefault: true }
      );

      return { success: true, message: 'Default email updated successfully' };
    } catch (error) {
      Configs.logger.error('Failed to set default email', { error });
      return { success: false, message: 'Failed to set default email' };
    }
  }
}
