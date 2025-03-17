import { CopperxPayoutService } from './copperxPayout.service';
import * as Configs from '../../src/configs';
import { UserModel } from '../models/User.model';

export class AuthService {
  private copperxService: CopperxPayoutService;

  constructor() {
    this.copperxService = new CopperxPayoutService();
  }

  async emailOtpRequest(email: string, telegramId: number) {
    try {
      // Request OTP from Copperx Payout
      const response = await this.copperxService.emailOtpRequest(email);
      
      if (!response) {
        return { success: false, message: 'Failed to request OTP' };
      }
      
      // Store the session ID for later verification
      await UserModel.findOneAndUpdate(
        { telegramId },
        { 
          email,
          sid: response.sid,
          lastOtpRequestTime: new Date()
        },
        { upsert: true }
      );
      
      return { success: true, message: 'OTP sent to your email' };
    } catch (error) {
      Configs.logger.error('Failed to request OTP', { error });
      return { success: false, message: 'Failed to request OTP' };
    }
  }

  async verifyOtp(telegramId: number, otp: string) {
    try {
      // Get user data
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.email || !user.sid) {
        return { success: false, message: 'Please request OTP first' };
      }
      
      // Verify OTP with Copperx Payout
      const response = await this.copperxService.emailOtpAuthenticate(user.email, otp, user.sid);
      
      if (!response) {
        return { success: false, message: 'Invalid OTP' };
      }
      
      // Store the token
      await UserModel.findOneAndUpdate(
        { telegramId },
        { 
          token: response.token,
          isAuthenticated: true,
          lastLoginTime: new Date()
        }
      );
      
      return { success: true, message: 'Authentication successful', token: response.token };
    } catch (error) {
      Configs.logger.error('Failed to verify OTP', { error });
      return { success: false, message: 'Failed to verify OTP' };
    }
  }

  async getUserProfile(telegramId: number) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const profile = await this.copperxService.authMe(user.token);
      
      if (!profile) {
        // Token might be expired
        await UserModel.findOneAndUpdate(
          { telegramId },
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

  async getKYCStatus(telegramId: number) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.token) {
        return { success: false, message: 'Please login first' };
      }
      
      const kycStatus = await this.copperxService.getKYCStatus(user.token);
      
      if (!kycStatus) {
        return { success: false, message: 'Failed to get KYC status' };
      }
      
      return { success: true, kycStatus };
    } catch (error) {
      Configs.logger.error('Failed to get KYC status', { error });
      return { success: false, message: 'Failed to get KYC status' };
    }
  }

  async reLogin(telegramId: number) {
    try {
      const user = await UserModel.findOne({ telegramId });
      
      if (!user || !user.email) {
        return { success: false, message: 'No previous login found' };
      }
      
      return await this.emailOtpRequest(user.email, telegramId);
    } catch (error) {
      Configs.logger.error('Failed to re-login', { error });
      return { success: false, message: 'Failed to re-login' };
    }
  }

  async logout(telegramId: number) {
    try {
      await UserModel.findOneAndUpdate(
        { telegramId },
        { isAuthenticated: false, token: null }
      );
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      Configs.logger.error('Failed to logout', { error });
      return { success: false, message: 'Failed to logout' };
    }
  }
}
