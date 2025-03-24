import * as Configs from '../../configs';
import * as Types from '../types';
import { CopperxPayoutService } from './copperxPayout.service';
import { AuthService } from './auth.service';
import { Context } from 'telegraf';

export class TransferService {
  private static instance: TransferService;
  private authService: AuthService;
  private copperxPayoutService: CopperxPayoutService;
  private context: Context;

  private constructor(context: Context) {
    this.context = context;
    this.copperxPayoutService = new CopperxPayoutService();
    this.authService = AuthService.getInstance(context);
  }

  public static getInstance(context: Context): TransferService {
    if (!TransferService.instance) {
      this.instance = new TransferService(context);
    }
    return this.instance;
  }

  private setAccessToken(accessToken: string): void {
    this.copperxPayoutService.setAccessToken(accessToken);
  }

  async sendPayment(
    chatId: number,
    input: Types.CreateSendTransferDto,
  ): Promise<Types.TransferWithAccountDto | null> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return null;
    }
    try {
      this.setAccessToken(accessToken);
      const transfer = await this.copperxPayoutService.sendPayment(
        accessToken,
        input,
      );

      Configs.logger.info('Payment sent', { chatId, transfer });

      // TODO: Send message

      return transfer;
    } catch (error) {
      Configs.logger.error('Failed to send payment', { chatId, error });

      // TODO: Send message

      return null;
    }
  }

  async withdrawBalance(
    chatId: number,
    input: Types.CreateWalletWithdrawTransferDto,
  ): Promise<Types.TransferWithAccountDto | null> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return null;
    }
    try {
      this.setAccessToken(accessToken);
      const transfer = await this.copperxPayoutService.withdrawBalanaceToWallet(
        accessToken,
        input,
      );

      Configs.logger.info('Balance withdrawn', { chatId, transfer });

      return transfer;
    } catch (error) {
      Configs.logger.error('Failed to withdraw balance', { chatId, error });

      return null;
    }
  }

  async createOfframpTransfer(
    chatId: number,
    input: Types.CreateOfframpTransferDto,
  ): Promise<Types.TransferWithAccountDto | null> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return null;
    }
    try {
      this.setAccessToken(accessToken);
      const transfer = await this.copperxPayoutService.createOfframpTransfer(
        accessToken,
        input,
      );

      Configs.logger.info('Offramp transfer created', { chatId, transfer });

      return transfer;
    } catch (error) {
      Configs.logger.error('Failed to create offramp transfer', {
        chatId,
        error,
      });

      return null;
    }
  }

  async sendPaymentInBatch(
    chatId: number,
    input: Types.CreateSendTransferBatchDto,
  ): Promise<Types.CreateSendTransferBatchResponseDto | null> {
    const accessToken = await this.authService.getAccessToken(chatId);
    if (!accessToken) {
      return null;
    }
    try {
      this.setAccessToken(accessToken);
      const response = await this.copperxPayoutService.sendPaymentInBatch(
        accessToken,
        input,
      );

      Configs.logger.info('Payment batch sent', { chatId, response });

      return response;
    } catch (error) {
      Configs.logger.error('Failed to send payment batch', { chatId, error });

      return null;
    }
  }
}
