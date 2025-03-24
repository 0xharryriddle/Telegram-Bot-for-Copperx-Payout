import {
  Country,
  Currency,
  ProviderCode,
  PurposeCode,
  RecipientRelationship,
  SourceOfFunds,
  TransactionAccountType,
  TransactionStatus,
  TransactionType,
  TransferMode,
  TransferStatus,
  TransferType,
  WalletAccountType,
} from './enum';

export interface WalletDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  walletType: WalletAccountType;
  network?: string;
  walletAddress?: string;
  isDefault?: boolean;
}

export interface BalanceResponseDto {
  decimals: number;
  balance: string;
  symbol: 'USDC' | 'USDT' | 'DAI' | 'ETH' | 'USDCE' | 'STRK';
  address: string;
}

export interface WalletBalanceDto {
  walletId: string;
  isDefault: boolean;
  network: string;
  balances: BalanceResponseDto[];
}

export interface SetDefaultWalletDto {
  walletId: string;
}

export interface TransactionDto {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  organizationId: string;
  type: TransactionType;
  providerCode: ProviderCode;
  kycId?: string | null;
  transferId?: string | null;
  status: TransactionStatus;
  externalStatus?: string | null;
  fromAccountId?: string | null;
  toAccountId?: string | null;
  fromAmount?: string | null;
  fromCurrency: Currency;
  toAmount?: string | null;
  toCurrency: Currency;
  totalFee?: string | null;
  feeCurrency: Currency;
  transactionHash?: string | null;
  depositAccount?: TransferAccountDto | null;
  externalTransactionId?: string | null;
  externalCustomerId?: string | null;
  depositUrl?: string | null;
}

export interface CustomerDto {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  name?: string | null;
  businessName?: string | null;
  email?: string | null;
  country?: string | null;
}

export interface TransferAccountDto {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  type: TransactionAccountType;
  country?: Country | null;
  network?: string | null;
  accountId?: string | null;
  walletAddress?: string | null;
  bankName?: string | null;
  bankAddress?: string | null;
  bankRoutingNumber?: string | null;
  bankAccountNumber?: string | null;
  bankDepositMessage?: string | null;
  wireMessage?: string | null;
  payeeEmail?: string | null;
  payeeOrganizationId?: string | null;
  payeeId?: string | null;
  payeeDisplayName?: string | null;
}

export interface TransferWithTransactionsDto {
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
  transactions?: TransactionDto[] | null;
  destinationAccount?: TransferAccountDto | null;
  sourceAccount?: TransferAccountDto | null;
  senderDisplayName?: string | null;
}

export interface GenerateWalletDto {
  network: string;
}
