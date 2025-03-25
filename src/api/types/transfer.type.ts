import {
  Country,
  Currency,
  PurposeCode,
  RecipientRelationship,
  SourceOfFunds,
  TransferMode,
  TransferStatus,
  TransferType,
} from './enum';
import { CustomerDto, TransferAccountDto } from './wallet.type';

export interface TransferWithAccountDto {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  organizationId: string;
  status: TransferStatus;
  customerId?: string | null;
  customer?: CustomerDto | null;
  type: TransferType | null;
  sourceCountry: Country;
  destinationCountry: Country;
  destinationCurrency?: Currency | null;
  amount: string;
  currency: Currency;
  amountSubtotal?: string | null;
  totalFee?: string | null;
  feePercentage?: string | null;
  feeCurrency?: Currency | null;
  invoiceNumber?: string | null;
  invoiceUrl?: string | null;
  sourceOfFundsFile?: string | null;
  note?: string | null;
  purposeCode?: PurposeCode | null;
  sourceOfFunds?: SourceOfFunds | null;
  recipientRelationship?: RecipientRelationship | null;
  sourceAccountId?: string | null;
  destinationAccountId?: string | null;
  paymentUrl?: string | null;
  mode?: TransferMode | null;
  isThirdPartyPayment: boolean;
  sourceAccount?: TransferAccountDto | null;
  destinationAccount?: TransferAccountDto | null;
  senderDisplayName?: string | null;
}

export interface CustomerDataDto {
  name?: string | null;
  businessName?: string | null;
  email?: string | null;
  country?: string | null;
}

export interface CreateOfframpTransferDto {
  invoiceNumber?: string | null;
  invoiceUrl?: string | null;
  purposeCode?: PurposeCode | null;
  sourceOfFunds?: SourceOfFunds | null;
  recipientRelationship?: RecipientRelationship | null;
  quotePayload: string;
  quoteSignature: string;
  preferredWalletId?: string | null;
  customerData?: CustomerDataDto | null;
  sourceOfFundsFile?: string | null;
  note?: string | null;
}

export interface CreateWalletWithdrawTransferDto {
  walletAddress: string;
  amount: string;
  purposeCode: PurposeCode;
  currency?: Currency | null;
}

export interface CreateSendTransferDto {
  walletAddress?: string | null;
  email?: string | null;
  payeeId?: string | null;
  amount: string;
  purposeCode: PurposeCode;
  currency?: Currency | null;
}

export interface CreateSendTransferBatchSingleRequestDto {
  requestId: string;
  request: CreateSendTransferDto;
}

export interface CreateSendTransferBatchDto {
  requests: CreateSendTransferBatchSingleRequestDto[];
}

export interface TransferDto {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  organizationId: string;
  status: TransferStatus;
  customerId?: string | null;
  customer?: CustomerDto | null;
  type: TransferType;
  sourceCountry: Country;
  destinationCountry: Country;
  destinationCurrency?: Currency | null;
  amount: string;
  currency: Currency;
  amountSubtotal?: string | null;
  totalFee?: string | null;
  feePercentage?: string | null;
  feeCurrency?: Currency | null;
  invoiceNumber?: string | null;
  invoiceUrl?: string | null;
  sourceOfFundsFile?: string | null;
  note?: string | null;
  purposeCode?: PurposeCode | null;
  sourceOfFunds?: SourceOfFunds | null;
  recipientRelationship?: RecipientRelationship | null;
  sourceAccountId?: string | null;
  destinationAccountId?: string | null;
  paymentUrl?: string | null;
  mode?: TransferMode | null;
  isThirdPartyPayment: boolean;
}

export interface ErrorDto {
  message: object;
  statusCode: number;
  error: string;
}

export interface CreateSendTransferBatchSingleResponseDto {
  requestId: string;
  request: CreateSendTransferDto;
  response: TransferDto;
  error?: ErrorDto;
}

export interface CreateSendTransferBatchResponseDto {
  responses: CreateSendTransferBatchSingleResponseDto[];
}
