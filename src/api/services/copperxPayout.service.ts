import axios, { AxiosError, AxiosInstance } from 'axios';
import { ChannelAuthorizationCallback } from 'pusher-js';

import * as Configs from '../../configs';
import { endpoints } from '../../utils/copperxPayoutEndpoint';
import * as Types from '../types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  Origin: 'https://income.copperx.io',
  Referer: 'https://income.copperx.io/',
};

const BASE_URL = Configs.ENV.BASE_URL;

export class CopperxPayoutService {
  public readonly baseApi: AxiosInstance;

  constructor() {
    this.baseApi = axios.create({
      baseURL: BASE_URL,
      headers: DEFAULT_HEADERS,
    });
    // this.testConnection();
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries = MAX_RETRIES,
    delayMs = RETRY_DELAY,
  ): Promise<T | null> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        const isAxiosError = error instanceof AxiosError;
        const statusCode = isAxiosError ? error.response?.status : null;

        // Don't retry on 4xx errors (client errors)
        if (
          isAxiosError &&
          statusCode &&
          statusCode >= 400 &&
          statusCode < 500
        ) {
          Configs.logger.error(`Client error: ${statusCode}`, { error });
          return null;
        }

        // Last attempt
        if (attempt === retries) {
          Configs.logger.error(`Request failed after ${retries} attempts`, {
            error,
          });
          return null;
        }

        // Log retry
        Configs.logger.info(
          `Request failed, retrying attempt ${attempt}/${retries}...`,
          { error },
        );

        // Delay before next retry
        await this.delay(delayMs);
      }
    }

    return null;
  }

  private async testConnection() {
    try {
      const response = await this.baseApi.get('');

      Configs.logger.info('CopperX Payout API connection test successful', {
        status: response.status,
        baseUrl: Configs.ENV.BASE_URL,
      });

      return true;
    } catch (error) {
      Configs.logger.error('CopperX Payout API connection test failed', {
        error,
        baseUrl: Configs.ENV.BASE_URL,
      });

      return false;
    }
  }

  setAccessToken(accessToken: string): void {
    this.baseApi.defaults.headers.common['Authorization'] =
      `Bearer ${accessToken}`;
  }

  /* ----------------------------- Authentication ----------------------------- */

  async requestEmailOtp(
    input: Types.LoginEmailOtpRequestDto,
  ): Promise<Types.LoginEmailOtpResponseDto> {
    try {
      const response = await this.baseApi.post<Types.LoginEmailOtpResponseDto>(
        endpoints.auth.emailOtpRequest.endpoint,
        input,
      );

      Configs.logger.info('Email OTP request successful', input);

      return response.data;
    } catch (error) {
      Configs.logger.error('Email OTP request failed', { error });

      throw error;
    }
  }

  async emailOtpAuthenticate(
    input: Types.VerifyEmailOtpRequestDto,
  ): Promise<Types.AuthenticateResponseDto> {
    try {
      const response = await this.baseApi.post<Types.AuthenticateResponseDto>(
        endpoints.auth.emailOtpAuthenticate.endpoint,
        input,
      );
      Configs.logger.info('Email OTP authentication successful', input);

      return response.data;
    } catch (error) {
      Configs.logger.error('Email OTP authentication failed', { error });

      throw error;
    }
  }

  async authMe(accessToken: string): Promise<Types.AuthUserDto> {
    try {
      const response = await this.baseApi.get<Types.AuthUserDto>(
        endpoints.auth.me.endpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      Configs.logger.info('Get user profile successful');

      return response.data;
    } catch (error) {
      Configs.logger.error('Get user profile failed', { error });

      throw error;
    }
  }

  async getKycStatus(
    accessToken: string,
    page = 1,
    limit = 10,
  ): Promise<Types.KycDto> {
    try {
      const response = await this.baseApi.get<Types.KycDto>(
        endpoints.kycs.get.endpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page,
            limit,
          },
        },
      );

      Configs.logger.info('Get KYC status successful');

      return response.data;
    } catch (error) {
      Configs.logger.error('Get KYC status failed', { error });

      throw error;
    }
  }

  /* ---------------------------- Wallet Management --------------------------- */

  async getWallets(accessToken: string): Promise<Types.WalletDto[]> {
    try {
      const response = await this.baseApi.get<Types.WalletDto[]>(
        endpoints.wallets.list.endpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData: Types.WalletDto[] = response.data;

      Configs.logger.info('Get wallets successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Get wallets failed', { error });
      throw error;
    }
  }

  async generateOrGetExistingWallet(
    accessToken: string,
    input: Types.GenerateWalletDto,
  ): Promise<Types.WalletDto> {
    try {
      const response = await this.baseApi.post<Types.WalletDto>(
        endpoints.wallets.generateOrGetExisting.endpoint,
        input,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData: Types.WalletDto = response.data;

      Configs.logger.info('Generate or get existing wallet successful');

      return responseData;
    } catch (error) {
      Configs.logger.error('Generate or get existing wallet failed', { error });
      throw error;
    }
  }

  async getDefaultBalance(
    accessToken: string,
  ): Promise<Types.WalletBalanceDto> {
    try {
      const response = await this.baseApi.get<Types.WalletBalanceDto>(
        endpoints.wallets.getDefaultBalance.endpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData = response.data;

      Configs.logger.info(
        'Get default wallet balance successful',
        responseData,
      );

      return responseData;
    } catch (error) {
      Configs.logger.error('Get default wallet balance failed', { error });
      throw error;
    }
  }

  async getWalletBalances(
    accessToken: string,
  ): Promise<Types.WalletBalanceDto[]> {
    try {
      const response = await this.baseApi.get<Types.WalletBalanceDto[]>(
        endpoints.wallets.getBalances.endpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData: Types.WalletBalanceDto[] = response.data;

      Configs.logger.info('Get wallet balances successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Get wallet balances failed', { error });
      throw error;
    }
  }

  async getTokenBalance(
    accessToken: string,
    chainId: string,
    token: string,
  ): Promise<Types.BalanceResponseDto> {
    try {
      const response = await this.baseApi.get<Types.BalanceResponseDto>(
        endpoints.wallets.getTokenBalance.endpoint
          .replaceAll('{chainId}', chainId)
          .replaceAll('{token}', token),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData = response.data;

      Configs.logger.info('Get token balance successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Get token balance failed', { error });
      throw error;
    }
  }

  async getDefaultWallet(accessToken: string): Promise<Types.WalletDto> {
    try {
      const response = await this.baseApi.get<Types.WalletDto>(
        endpoints.wallets.getDefault.endpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData: Types.WalletDto = response.data;

      Configs.logger.info('Get default wallet successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Get default wallet failed', { error });
      throw error;
    }
  }

  async setDefaultWallet(
    accessToken: string,
    input: Types.SetDefaultWalletDto,
  ): Promise<Types.WalletDto> {
    try {
      const response = await this.baseApi.post<Types.WalletDto>(
        endpoints.wallets.setDefault.endpoint,
        input,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData: Types.WalletDto = response.data;

      Configs.logger.info('Set default wallet successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Set default wallet failed', { error });
      throw error;
    }
  }

  // @note - Set page and limit as default to get the transfer listing
  async getTransactionsHistory(
    accessToken: string,
    page = 1,
    limit = 10,
    sourceCountry?: Types.Country,
    destinationCountry?: Types.Country,
    status?: Types.TransferStatus,
    sync?: boolean,
    type?: Types.TransferType,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Types.TransferWithTransactionsDto[]> {
    try {
      const query: Record<string, any> = {
        page,
        limit,
        ...(sourceCountry && { sourceCountry }),
        ...(destinationCountry && { destinationCountry }),
        ...(status && { status }),
        ...(sync !== undefined && { sync }),
        ...(type && { type }),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
      };

      const response = await this.baseApi.get<{
        page: number;
        limit: number;
        count: number;
        hasMore: boolean;
        data: Types.TransferWithTransactionsDto[];
      }>(endpoints.wallets.list.endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: query,
      });

      const responseData: Types.TransferWithTransactionsDto[] =
        response.data.data;

      Configs.logger.info('Get transactions history successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Get transactions history failed', { error });
      throw error;
    }
  }

  async supportedNetworks(accessToken: string): Promise<string[]> {
    try {
      const response = await this.baseApi.get<string[]>(
        endpoints.wallets.supportedNetworks.endpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData = response.data;

      Configs.logger.info('Get supported networks successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Get supported networks failed', { error });
      throw error;
    }
  }

  /* ------------------------------ Fund Transfer ----------------------------- */

  async sendPayment(
    accessToken: string,
    input: Types.CreateSendTransferDto,
  ): Promise<Types.TransferWithAccountDto> {
    try {
      const response = await this.baseApi.post<Types.TransferWithAccountDto>(
        endpoints.transfers.sendPayment.endpoint,
        input,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData: Types.TransferWithAccountDto = response.data;

      Configs.logger.info('Send payment successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Send payment failed', { error });
      throw error;
    }
  }

  async withdrawBalanaceToWallet(
    accessToken: string,
    input: Types.CreateWalletWithdrawTransferDto,
  ): Promise<Types.TransferWithAccountDto> {
    try {
      const response = await this.baseApi.post<Types.TransferWithAccountDto>(
        endpoints.transfers.withdrawBalance.endpoint,
        input,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData: Types.TransferWithAccountDto = response.data;

      Configs.logger.info('Send funds to wallet successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Send funds to wallet failed', { error });
      throw error;
    }
  }

  async createOfframpTransfer(
    accessToken: string,
    input: Types.CreateOfframpTransferDto,
  ): Promise<Types.TransferWithAccountDto> {
    try {
      const response = await this.baseApi.post<Types.TransferWithAccountDto>(
        endpoints.transfers.createOfframpTransfer.endpoint,
        input,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData: Types.TransferWithAccountDto = response.data;

      Configs.logger.info('Withdraw to bank successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Withdraw to bank failed', { error });
      throw error;
    }
  }

  async sendPaymentInBatch(
    accessToken: string,
    input: Types.CreateSendTransferBatchDto,
  ): Promise<Types.CreateSendTransferBatchResponseDto> {
    try {
      const response =
        await this.baseApi.post<Types.CreateSendTransferBatchResponseDto>(
          endpoints.transfers.sendPaymentInBatch.endpoint,
          input,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

      const responseData = response.data;

      Configs.logger.info('Send payment in batch successful', responseData);

      return responseData;
    } catch (error) {
      Configs.logger.error('Send payment in batch failed', { error });
      throw error;
    }
  }

  /* -------------------------- Deposit Notifications ------------------------- */

  async notificationAuth(
    accessToken: string,
    input: Types.NotificationAuthDto,
    callback: ChannelAuthorizationCallback,
  ): Promise<void> {
    try {
      const response =
        await this.baseApi.post<Types.NotificationAuthResponseDto>(
          endpoints.notifications.auth.endpoint,
          input,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

      const responseData = response.data;

      if (responseData) {
        Configs.logger.info('Notification auth successful');

        callback(null, responseData);
      } else {
        Configs.logger.error('Notification auth failed');

        callback(new Error('Notification auth failed'), null);
      }
    } catch (error) {
      Configs.logger.error('Pusher authorization error:', { error });
      callback(error as Error | null, null);
    }
  }
}
