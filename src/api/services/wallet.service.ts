import createDebug from 'debug';
import * as Configs from '../../configs/index';
import * as Types from '../types/index';
import { AuthService } from './auth.service';
import { CopperxPayoutService } from './copperxPayout.service';

const debug = createDebug('bot:wallet-service');

export class WalletService {
  private static instance: WalletService;
  private authService: AuthService;
  private copperxPayoutService: CopperxPayoutService;

  private constructor() {
    this.authService = AuthService.getInstance();
    this.copperxPayoutService = new CopperxPayoutService();
  }

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      this.instance = new WalletService();
    }
    return this.instance;
  }

  private setAccessToken(accessToken: string): void {
    this.copperxPayoutService.setAccessToken(accessToken);
  }

  async getWallets(chatId: number): Promise<Types.WalletDto[]> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return [];
    }
    try {
      this.setAccessToken(accessToken);
      const wallets = await this.copperxPayoutService.getWallets(accessToken);
      return wallets;
    } catch (error) {
      debug('Failed to get wallets', { chatId, error });

      return [];
    }
  }

  async generateOrGetExisting(
    chatId: number,
    input: Types.GenerateWalletDto,
  ): Promise<Types.WalletDto | null> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return null;
    }
    try {
      this.setAccessToken(accessToken);
      Configs.logger.info('Generating wallet', { chatId });
      const wallet =
        await this.copperxPayoutService.generateOrGetExistingWallet(
          accessToken,
          input,
        );

      return wallet;
    } catch (error) {
      Configs.logger.error('Failed to generate wallet', { chatId, error });

      return null;
    }
  }

  async getDefaultWallet(chatId: number): Promise<Types.WalletDto | null> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return null;
    }
    try {
      this.setAccessToken(accessToken);
      const wallet =
        await this.copperxPayoutService.getDefaultWallet(accessToken);
      return wallet;
    } catch (error) {
      Configs.logger.error('Failed to get default wallet', { chatId, error });

      return null;
    }
  }

  async setDefaultWallet(
    chatId: number,
    input: Types.SetDefaultWalletDto,
  ): Promise<Types.WalletDto | null> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return null;
    }
    try {
      this.setAccessToken(accessToken);
      const wallet = await this.copperxPayoutService.setDefaultWallet(
        accessToken,
        input,
      );
      return wallet;
    } catch (error) {
      Configs.logger.error('Failed to set default wallet', { chatId, error });

      return null;
    }
  }

  async getDefaultWalletBalance(
    chatId: number,
  ): Promise<Types.WalletBalanceDto | null> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return null;
    }
    try {
      this.setAccessToken(accessToken);
      const balance =
        await this.copperxPayoutService.getDefaultBalance(accessToken);
      return balance;
    } catch (error) {
      Configs.logger.error('Failed to get default wallet balance', {
        error,
        chatId,
      });
      return null;
    }
  }

  async getWalletsBalances(chatId: number): Promise<Types.WalletBalanceDto[]> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return [];
    }
    try {
      this.setAccessToken(accessToken);
      const balances =
        await this.copperxPayoutService.getWalletBalances(accessToken);
      return balances;
    } catch (error) {
      Configs.logger.error('Failed to get wallets balances', { chatId, error });

      return [];
    }
  }

  async getTokenBalance(
    chatId: number,
    chainId: string,
    token: string,
  ): Promise<Types.BalanceResponseDto | null> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return null;
    }
    try {
      this.setAccessToken(accessToken);
      const balance = await this.copperxPayoutService.getTokenBalance(
        accessToken,
        chainId,
        token,
      );
      return balance;
    } catch (error) {
      Configs.logger.error('Failed to get token balance', { chatId, error });

      return null;
    }
  }

  async getSupportedNetworks(chatId: number): Promise<string[]> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return [];
    }
    try {
      this.setAccessToken(accessToken);
      const networks =
        await this.copperxPayoutService.supportedNetworks(accessToken);
      return networks;
    } catch (error) {
      Configs.logger.error('Failed to get supported networks', {
        chatId,
        error,
      });

      return [];
    }
  }

  // @note - 10 last transactions
  async getTransactionsHistory(
    chatId: number,
  ): Promise<Types.TransferWithTransactionsDto[]> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return [];
    }
    try {
      this.setAccessToken(accessToken);
      const transactions =
        await this.copperxPayoutService.getTransactionsHistory(accessToken);

      return transactions || [];
    } catch (error) {
      Configs.logger.error("Failed to get user's transaction history", {
        chatId,
        error,
      });
      return [];
    }
  }
}
