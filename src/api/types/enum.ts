export enum UserRole {
  owner = 'owner',
  user = 'user',
  admin = 'admin',
  member = 'member',
}

export enum UserStatus {
  pending = 'pending',
  active = 'active',
  suspended = 'suspended',
}

export enum CustomerProfileType {
  individual = 'individual',
  business = 'business',
}

export enum KycProviderCode {
  sumsub = 'sumsub',
  sumsub_uae = 'sumsub_uae',
  sumsub_global = 'sumsub_global',
  hyperverge_ind = 'hyperverge_ind',
  persona = 'persona',
  manual = 'manual',
}

export enum KycStatus {
  pending = 'pending',
  initiated = 'initiated',
  inprogress = 'inprogress',
  review_pending = 'review_pending',
  review = 'review',
  provider_manual_review = 'provider_manual_review',
  manual_review = 'manual_review',
  provider_on_hold = 'provider_on_hold',
  on_hold = 'on_hold',
  expired = 'expired',
  approved = 'approved',
  rejected = 'rejected',
}

export enum KycDocumentType {
  passport = 'passport',
  aadhar_card = 'aadhar_card',
  pan_card = 'pan_card',
  driving_license = 'driving_license',
  national_id = 'national_id',
  tax_id = 'tax_id',
  voter_id = 'voter_id',
  utility_bill = 'utility_bill',
  bank_statement = 'bank_statement',
  proof_of_address = 'proof_of_address',
  other = 'other',
}

export enum KycDocumentVerificationStatus {
  pending = 'pending',
  initiated = 'initiated',
  inprogress = 'inprogress',
  review_pending = 'review_pending',
  provider_manual_review = 'provider_manual_review',
  manual_review = 'manual_review',
  provider_on_hold = 'provider_on_hold',
  review = 'review',
  on_hold = 'on_hold',
  verified = 'verified',
  rejected = 'rejected',
}

export enum UBOType {
  owner = 'owner',
  signer = 'signer',
  control = 'control',
}

export enum KybDocumentType {
  certificate_of_incorporation = 'certificate_of_incorporation',
  memorandum_of_association = 'memorandum_of_association',
  articles_of_association = 'articles_of_association',
  corporate_structure = 'corporate_structure',
  director_structure = 'director_structure',
  proof_of_address = 'proof_of_address',
  authorization_document = 'authorization_document',
  other = 'other',
}

export enum KybDocumentVerificationStatus {
  pending = 'pending',
  initiated = 'initiated',
  inprogress = 'inprogress',
  review_pending = 'review_pending',
  provider_manual_review = 'provider_manual_review',
  manual_review = 'manual_review',
  provider_on_hold = 'provider_on_hold',
  review = 'review',
  on_hold = 'on_hold',
  verified = 'verified',
  rejected = 'rejected',
}

export enum PurposeOfFund {
  business_transactions = 'business_transactions',
  charitable_donations = 'charitable_donations',
  investment_purposes = 'investment_purposes',
  payments_to_friends_or_family_abroad = 'payments_to_friends_or_family_abroad',
  payroll = 'payroll',
  personal_or_living_expenses = 'personal_or_living_expenses',
  protect_wealth = 'protect_wealth',
  purchase_goods_and_services = 'purchase_goods_and_services',
  receive_payments_for_goods_and_services = 'receive_payments_for_goods_and_services',
  tax_optimization = 'tax_optimization',
  other = 'other',
}

export enum HighRiskActivity {
  marijuana_or_related_services = 'marijuana_or_related_services',
  adult_entertainment = 'adult_entertainment',
  gambling = 'gambling',
  hold_client_funds = 'hold_client_funds',
  investment_services = 'investment_services',
  lending_banking = 'lending_banking',
  money_services = 'money_services',
  operate_foreign_exchange_virtual_currencies_brokerage_otc = 'operate_foreign_exchange_virtual_currencies_brokerage_otc',
  safe_deposit_box_rentals = 'safe_deposit_box_rentals',
  third_party_payment_processing = 'third_party_payment_processing',
  weapons_firearms_and_explosives = 'weapons_firearms_and_explosives',
  none_of_the_above = 'none_of_the_above',
}

export enum ProviderCode {
  code_0x0 = '0x0',
  code_0x1 = '0x1',
  code_0x2 = '0x2',
  code_0x11 = '0x11',
  code_0x21 = '0x21',
  code_0x22 = '0x22',
  code_0x31 = '0x31',
  code_0x41 = '0x41',
  code_0x23 = '0x23',
  code_0x24 = '0x24',
  code_0xffff = '0xffff',
}

export enum WalletAccountType {
  web3_auth_copperx = 'web3_auth_copperx',
  safe = 'safe',
  circle_dev = 'circle_dev',
  eoa = 'eoa',
  other = 'other',
  quantum = 'quantum',
}

export enum TransactionType {
  send = 'send',
  receive = 'receive',
  withdraw = 'withdraw',
  internal = 'internal',
  deposit = 'deposit',
  bridge = 'bridge',
}

export enum TransactionStatus {
  pending = 'pending',
  initiated = 'initiated',
  processing = 'processing',
  awaiting_funds = 'awaiting_funds',
  funds_received = 'funds_received',
  payment_submitted = 'payment_submitted',
  waiting_for_payee_kyc = 'waiting_for_payee_kyc',
  success = 'success',
  canceled = 'canceled',
  failed = 'failed',
}

export enum Currency {
  USD = 'USD',
  INR = 'INR',
  AED = 'AED',
  IDR = 'IDR',
  PKR = 'PKR',
  SGD = 'SGD',
  EUR = 'EUR',
  MYR = 'MYR',
  CAD = 'CAD',
  KYD = 'KYD',
  LBP = 'LBP',
  TRY = 'TRY',
  XCD = 'XCD',
  VND = 'VND',
  THB = 'THB',
  HKD = 'HKD',
  BDT = 'BDT',
  PHP = 'PHP',
  KHR = 'KHR',
  AUD = 'AUD',
  GBP = 'GBP',
  NPR = 'NPR',
  LKR = 'LKR',
  XOF = 'XOF',
  XAF = 'XAF',
  GHS = 'GHS',
  KES = 'KES',
  MZN = 'MZN',
  TZS = 'TZS',
  UGX = 'UGX',
  NZD = 'NZD',
  KRW = 'KRW',
  MMK = 'MMK',
  JPY = 'JPY',
  BRL = 'BRL',
  CNY = 'CNY',
  USDC = 'USDC',
  USDT = 'USDT',
  DAI = 'DAI',
  ETH = 'ETH',
  USDCE = 'USDCE',
  STRK = 'STRK',
}

export enum TransactionAccountType {
  web3_wallet = 'web3_wallet',
  bank_ach = 'bank_ach',
  bank_ach_push = 'bank_ach_push',
  bank_wire = 'bank_wire',
  bank_transfer = 'bank_transfer',
  bank_ifsc = 'bank_ifsc',
  bank_iban = 'bank_iban',
}

export enum Country {
  usa = 'usa',
  ind = 'ind',
  are = 'are',
  idn = 'idn',
  pak = 'pak',
  sgp = 'sgp',
  esp = 'esp',
  can = 'can',
  cym = 'cym',
  lbn = 'lbn',
  mys = 'mys',
  pan = 'pan',
  tur = 'tur',
  vct = 'vct',
  vgb = 'vgb',
  vnm = 'vnm',
  bel = 'bel',
  tha = 'tha',
  hkg = 'hkg',
  aut = 'aut',
  hrv = 'hrv',
  cyp = 'cyp',
  est = 'est',
  fin = 'fin',
  fra = 'fra',
  gre = 'gre',
  irl = 'irl',
  ita = 'ita',
  lva = 'lva',
  ltu = 'ltu',
  lux = 'lux',
  mlt = 'mlt',
  nld = 'nld',
  prt = 'prt',
  svk = 'svk',
  svn = 'svn',
  deu = 'deu',
  bgd = 'bgd',
  phl = 'phl',
  khm = 'khm',
  aus = 'aus',
  gbr = 'gbr',
  npl = 'npl',
  lka = 'lka',
  ben = 'ben',
  cmr = 'cmr',
  gha = 'gha',
  ken = 'ken',
  moz = 'moz',
  sen = 'sen',
  tza = 'tza',
  uga = 'uga',
  nzl = 'nzl',
  kor = 'kor',
  mmr = 'mmr',
  jpn = 'jpn',
  bra = 'bra',
  chn = 'chn',
  none = 'none',
}

export enum TransferStatus {
  pending = 'pending',
  initiated = 'initiated',
  processing = 'processing',
  success = 'success',
  canceled = 'canceled',
  failed = 'failed',
  refunded = 'refunded',
}

export enum TransferType {
  send = 'send',
  receive = 'receive',
  withdraw = 'withdraw',
  deposit = 'deposit',
  bridge = 'bridge',
  bank_deposit = 'bank_deposit',
}

export enum PurposeCode {
  self = 'self',
  salary = 'salary',
  gift = 'gift',
  income = 'income',
  saving = 'saving',
  education_support = 'education_support',
  family = 'family',
  home_improvement = 'home_improvement',
  reimbursement = 'reimbursement',
}

export enum SourceOfFunds {
  salary = 'salary',
  savings = 'savings',
  lottery = 'lottery',
  investment = 'investment',
  loan = 'loan',
  business_income = 'business_income',
  others = 'others',
}

export enum RecipientRelationship {
  self = 'self',
  spouse = 'spouse',
  son = 'son',
  daughter = 'daughter',
  father = 'father',
  mother = 'mother',
  other = 'other',
}

export enum TransferMode {
  on_ramp = 'on_ramp',
  off_ramp = 'off_ramp',
  remittance = 'remittance',
  on_chain = 'on_chain',
}
