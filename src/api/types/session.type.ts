import * as Types from '../types';

export enum UserState {
  IDLE = 'IDLE',
  AWAITING_LOGIN_EMAIL = 'AWAITING_LOGIN_EMAIL',
  AWAITING_OTP = 'AWAITING_OTP',
  AUTHENTICATED = 'AUTHENTICATED',
  AWAITING_RECIPIENT_EMAIL = 'AWAITING_RECIPIENT_EMAIL',
  AWAITING_WALLET_ADDRESS = 'AWAITING_WALLET_ADDRESS',
  AWAITING_AMOUNT = 'AWAITING_AMOUNT',
  AWAITING_CURRENCY = 'AWAITING_CURRENCY',
  AWAITING_PURPOSE = 'AWAITING_PURPOSE',
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
}

export interface UserSession {
  chatId: number;
  state: UserState;
  email?: string;
  userId?: string;
  kycVerified?: boolean;
  lastCommandAt: number;
  transferData?: {
    method?: 'email' | 'wallet';
    email?: string;
    walletAddress?: string;
    amount?: string;
    currency?: Types.Currency;
    purposeCode?: Types.PurposeCode;
  };
  authData?: {
    sid?: string;
    accessToken?: string;
    accessTokenId?: string;
    expireAt?: string;
  };
}
