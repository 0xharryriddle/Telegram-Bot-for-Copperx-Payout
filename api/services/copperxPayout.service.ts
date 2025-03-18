import axios, { AxiosError } from 'axios';
// import { Cloudscraper, CloudscraperAPI } from 'cloudscraper';
import * as Configs from '../../src/configs';
import * as Utils from '../../src/utils';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "Origin": "https://income.copperx.io",
  "Referer": "https://income.copperx.io/"
};

export class CopperxPayoutService {
  private endpoints: Utils.ApiEndpoints;
  // private cloudscraper: CloudscraperAPI;

  constructor() {
    this.endpoints = Utils.endpoints;
    this.testConnection();
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries = MAX_RETRIES,
    delayMs = RETRY_DELAY
  ): Promise<T | null> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        const isAxiosError = error instanceof AxiosError;
        const statusCode = isAxiosError ? error.response?.status : null;
        
        // Don't retry on 4xx errors (client errors)
        if (isAxiosError && statusCode && statusCode >= 400 && statusCode < 500) {
          Configs.logger.error(`Client error: ${statusCode}`, { error });
          return null;
        }
        
        // Last attempt
        if (attempt === retries) {
          Configs.logger.error(`Request failed after ${retries} attempts`, { error });
          return null;
        }
        
        // Log retry attempt
        Configs.logger.warn(`Request failed (attempt ${attempt}/${retries}), retrying in ${delayMs}ms`, {
          error: isAxiosError ? error.message : error
        });
        
        await this.delay(delayMs);
      }
    }
    return null;
  }

  private async testConnection() {
    try {
      const result = await this.retryRequest(async () => {
        const response = await axios.request({
          method: 'GET',
          url: this.endpoints.base.endpoint,
          headers: DEFAULT_HEADERS,
          validateStatus: (status) => status === 200 || status === 404 // Accept 404 as valid for testing
        });
        // const response = await cloudscraper.
        if (response.status !== 200) throw new Error('Connection failed');
        return response;
      });
      
      if (result) {
        Configs.logger.info('Copperx Payout connection successful');
      } else {
        throw new Error('Connection failed after retries');
      }
    } catch (error) {
      Configs.logger.error('Copperx Payout connection failed', { error });
    }
  }

  async emailOtpRequest(email: string) {
    return await this.retryRequest(async () => {
      const result = await axios.request({
        method: 'POST',
        url: this.endpoints.auth.emailOtpRequest.endpoint,
        headers: DEFAULT_HEADERS,
        data: { email }
      });

      console.log(result);
      if (result.status !== 200) throw new Error('Login failed');
      return result.data;
    });
  }

  async emailOtpAuthenticate(email: string, otp: string, sid: string) {
    return await this.retryRequest(async () => {
      const result = await axios.request({
        method: 'POST',
        url: this.endpoints.auth.emailOtpAuthenticate.endpoint,
        headers: DEFAULT_HEADERS,
        data: { email, otp, sid }
      });
      if (result.status !== 200) throw new Error('OTP verification failed');
      return result.data;
    });
  }

  async authMe(token: string) {
    try {
      const result = await axios.request({
        method: 'GET',
        url: this.endpoints.auth.me.endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
          "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
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
