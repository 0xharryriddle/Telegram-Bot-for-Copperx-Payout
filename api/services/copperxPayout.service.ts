import axios from 'axios';
import * as Configs from '../../src/configs';
import * as Utils from '../../src/utils';

export class CopperxPayoutService {
  private endpoints: Utils.ApiEndpoints;

  constructor() {
    this.endpoints = Utils.endpoints;

    this.testConnection();
  }

  private async testConnection() {
    try {
      const result = await axios.request({
        method: 'GET',
        url: this.endpoints.base.endpoint,
      });
      if (result.status != 200) throw new Error('Connection failed');
      Configs.logger.info('Copperx Payout connection successful');
    } catch (error) {
      Configs.logger.error('Copperx Payout connection failed', { error });
    }
  }

  async emailOtpRequest(email: string) {
    try {
      const result = await axios.request({
        method: 'POST',
        url: this.endpoints.auth.emailOtpRequest.endpoint,
        data: { email },
      });
      if (result.status != 200) throw new Error('Login failed');
      return result.data;
    } catch (error) {
      Configs.logger.error('Copperx Payout login failed', { error });
      return null;
    }
  }

  async emailOtpAuthenticate(email: string, otp: string, sid: string) {
    try {
      const result = await axios.request({
        method: 'POST',
        url: this.endpoints.auth.emailOtpAuthenticate.endpoint,
        data: { email, otp, sid },
      });
      if (result.status != 200) throw new Error('OTP verification failed');
      return result.data;
    } catch (error) {
      Configs.logger.error('Copperx Payout OTP verification failed', { error });
      return null;
    }
  }

  async authMe(token: string) {
    try {
      const result = await axios.request({
        method: 'GET',
        url: this.endpoints.auth.me.endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status != 200) throw new Error('Failed to get user profile');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to get user profile', { error });
      return null;
    }
  }

  async getKYCStatus(token: string) {
    try {
      const result = await axios.request({
        method: 'GET',
        url: `${Configs.ENV.BASE_URL}/kycs`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status != 200) throw new Error('Failed to get KYC status');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to get KYC status', { error });
      return null;
    }
  }

  async getWallets(token: string) {
    try {
      const result = await axios.request({
        method: 'GET',
        url: this.endpoints.wallets.list.endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status != 200) throw new Error('Failed to get wallets');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to get wallets', { error });
      return null;
    }
  }

  async getWalletBalances(token: string) {
    try {
      const result = await axios.request({
        method: 'GET',
        url: this.endpoints.wallets.getBalances.endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status != 200) throw new Error('Failed to get wallet balances');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to get wallet balances', { error });
      return null;
    }
  }

  async getDefaultWallet(token: string) {
    try {
      const result = await axios.request({
        method: 'GET',
        url: this.endpoints.wallets.getDefault.endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status != 200) throw new Error('Failed to get default wallet');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to get default wallet', { error });
      return null;
    }
  }

  async setDefaultWallet(token: string, walletId: string) {
    try {
      const result = await axios.request({
        method: 'PUT',
        url: this.endpoints.wallets.setDefault.endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { walletId },
      });
      if (result.status != 200) throw new Error('Failed to set default wallet');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to set default wallet', { error });
      return null;
    }
  }

  async getTransactionHistory(token: string, page = 1, limit = 10) {
    try {
      const result = await axios.request({
        method: 'GET',
        url: `${Configs.ENV.BASE_URL}/transfers?page=${page}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status != 200) throw new Error('Failed to get transaction history');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to get transaction history', { error });
      return null;
    }
  }

  async sendFundsToEmail(token: string, email: string, amount: number, currency: string, message?: string) {
    try {
      const result = await axios.request({
        method: 'POST',
        url: `${Configs.ENV.BASE_URL}/transfers/send`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          email,
          amount,
          currency,
          message: message || '',
        },
      });
      if (result.status != 200) throw new Error('Failed to send funds');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to send funds', { error });
      return null;
    }
  }

  async sendFundsToWallet(token: string, address: string, amount: number, currency: string, network: string) {
    try {
      const result = await axios.request({
        method: 'POST',
        url: `${Configs.ENV.BASE_URL}/transfers/wallet-withdraw`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          address,
          amount,
          currency,
          network,
        },
      });
      if (result.status != 200) throw new Error('Failed to send funds to wallet');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to send funds to wallet', { error });
      return null;
    }
  }

  async withdrawToBank(token: string, amount: number, currency: string) {
    try {
      const result = await axios.request({
        method: 'POST',
        url: `${Configs.ENV.BASE_URL}/transfers/offramp`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          amount,
          currency,
        },
      });
      if (result.status != 200) throw new Error('Failed to withdraw to bank');
      return result.data;
    } catch (error) {
      Configs.logger.error('Failed to withdraw to bank', { error });
      return null;
    }
  }
}
