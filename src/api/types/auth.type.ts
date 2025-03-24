import {
  CustomerProfileType,
  HighRiskActivity,
  KybDocumentType,
  KybDocumentVerificationStatus,
  KycDocumentType,
  KycDocumentVerificationStatus,
  KycProviderCode,
  KycStatus,
  ProviderCode,
  PurposeOfFund,
  UBOType,
  UserRole,
  UserStatus,
} from './enum';

export interface LoginEmailOtpRequestDto {
  email: string;
}

export interface LoginEmailOtpResponseDto {
  email: string;
  sid: string;
}

export interface VerifyEmailOtpRequestDto {
  email: string;
  otp: string;
  sid: string;
}

export interface AuthUserDto {
  id: string;
  role: UserRole;
  status: UserStatus;
  type: string;
  relayerAddress: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
  organizationId?: string;
  flags?: string[];
  walletAddress?: string;
  walletId?: string;
  walletAccountType?: string;
}

export interface AuthenticateResponseDto {
  scheme: string;
  accessToken: string;
  accessTokenId: string;
  expireAt: string;
  user: AuthUserDto;
}

export interface KycVerificationDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  kycDetailId: string;
  kycProviderCode: KycProviderCode;
  externalCustomerId?: string;
  externalKycId?: string;
  status: KycStatus;
  externalStatus?: string;
  verifiedAt?: string;
}

export interface KycDocumentDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  kycDetailId: string;
  documentType: KycDocumentType;
  status?: KycDocumentVerificationStatus;
  frontFileName?: string;
  backFileName?: string;
}

export interface KycDetailDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  kybDetailId: string;
  nationality: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  positionAtCompany: string;
  sourceOfFund: string;
  currentKycVerificationId: string;
  currentKycVerification: KycVerificationDto;
  kycDocuments: KycDocumentDto[];
  kycUrl: string;
  uboType: UBOType;
  percentageOfShares: number;
  joiningDate: string;
}

export interface KybVerificationDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  kybDetailId: string;
  kybProviderCode: KycProviderCode;
  externalCustomerId?: string;
  externalKybId?: string;
  status: KycStatus;
  externalStatus?: string;
  verifiedAt?: string;
}

export interface KybDocumentDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  kybDetailId: string;
  documentType: KybDocumentType;
  status?: KybDocumentVerificationStatus;
  frontFileName?: string;
  backFileName?: string;
}

export interface KybDetailDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  companyName?: string;
  companyDescription?: string;
  website?: string;
  incorporationDate?: string;
  incorporationCountry?: string;
  incorporationNumber?: string;
  companyType?: string;
  companyTypeOther?: string;
  natureOfBusiness?: string;
  natureOfBusinessOther?: string;
  sourceOfFund?: string;
  sourceOfFundOther?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state: string;
  postalCode?: string;
  country?: string;
  email?: string;
  phoneNumber?: string;
  currentKybVerificationId?: string;
  currentKybVerification?: KybVerificationDto;
  kybDocuments?: [];
  kycDetails?: KycDetailDto[];
  sourceOfFundDescription?: string;
  expectedMonthlyVolume?: number;
  purposeOfFund?: PurposeOfFund;
  purposeOfFundOther?: string;
  operatesInProhibitedCountries?: boolean;
  taxIdentificationNumber?: string;
  highRiskActivities?: HighRiskActivity[];
}

export interface KycAdditionalDocumentDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  kycId: string;
  name: string;
  fileName?: string;
}

export interface KycDto {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  organizationId: string;
  status: KycStatus;
  type: CustomerProfileType;
  country?: string;
  providerCode: ProviderCode;
  kycProviderCode?: KycProviderCode;
  kycDetailId?: string;
  kybDetailId?: string;
  kycDetail?: KycDetailDto;
  kybDetail?: KybDetailDto;
  kycAdditionalDocuments?: KycAdditionalDocumentDto[];
  statusUpdates?: string;
}
