interface BaseEndpoint {
  name: string;
  endpoint: string;
}

// Notification endpoints interface
interface NotificationEndpoints {
  auth: BaseEndpoint;
}

// Auth endpoints interface
interface AuthEndpoints {
  emailOtpRequest: BaseEndpoint;
  emailOtpAuthenticate: BaseEndpoint;
  logout: BaseEndpoint;
  me: BaseEndpoint;
}

// KYC endpoints interface
interface KycEndpoints {
  get: BaseEndpoint;
}

// Transfer endpoints interface
interface TransferEndpoints {
  sendPayment: BaseEndpoint;
  withdrawBalance: BaseEndpoint;
  createOfframpTransfer: BaseEndpoint;
  sendPaymentInBatch: BaseEndpoint;
}

// Wallet endpoints interface
interface WalletEndpoints {
  list: BaseEndpoint;
  getDefault: BaseEndpoint;
  setDefault: BaseEndpoint;
  getDefaultBalance: BaseEndpoint;
  getBalances: BaseEndpoint;
  generateOrGetExisting: BaseEndpoint;
  supportedNetworks: BaseEndpoint;
  getTokenBalance: BaseEndpoint;
}

// Root endpoint interface
interface ApiEndpoints {
  base: BaseEndpoint;
  auth: AuthEndpoints;
  kycs: KycEndpoints;
  wallets: WalletEndpoints;
  transfers: TransferEndpoints;
  notifications: NotificationEndpoints;
}

const endpoints: ApiEndpoints = {
  base: {
    name: 'root',
    endpoint: `/`,
  },
  auth: {
    emailOtpRequest: {
      name: 'Email OTP Request',
      endpoint: `/api/auth/email-otp/request`,
    },
    emailOtpAuthenticate: {
      name: 'Email OTP Authenticate',
      endpoint: `/api/auth/email-otp/authenticate`,
    },
    logout: {
      name: 'Logout',
      endpoint: `/api/auth/logout`,
    },
    me: {
      name: 'Get User Info',
      endpoint: `/api/auth/me`,
    },
  },
  kycs: {
    get: {
      name: 'Get KYC',
      endpoint: '/api/kycs',
    },
  },
  wallets: {
    list: {
      name: 'List Wallets',
      endpoint: `/api/wallets`,
    },
    generateOrGetExisting: {
      name: 'Generate Wallet',
      endpoint: `/api/wallets`,
    },
    getDefault: {
      name: 'Get Default Wallet',
      endpoint: `/api/wallets/default`,
    },
    setDefault: {
      name: 'Set Default Wallet',
      endpoint: `/api/wallets/default`,
    },
    getDefaultBalance: {
      name: 'Get Default Wallet Balance',
      endpoint: `/api/wallets/balance`,
    },
    getBalances: {
      name: 'Get All Balances',
      endpoint: `/api/wallets/balances`,
    },
    supportedNetworks: {
      name: 'Supported Networks',
      endpoint: `/api/wallets/networks`,
    },
    getTokenBalance: {
      name: 'Get Token Balance',
      endpoint: `/api/wallets/{chainId}/tokens/{token}/balance`,
    },
  },
  transfers: {
    sendPayment: {
      name: 'Send Payment',
      endpoint: `/api/transfers/send`,
    },
    withdrawBalance: {
      name: 'Withdraw Balance',
      endpoint: `/api/transfers/wallet-withdraw`,
    },
    createOfframpTransfer: {
      name: 'Create Offramp Transfer',
      endpoint: `/api/transfers/offramp`,
    },
    sendPaymentInBatch: {
      name: 'Send Payment In Batch',
      endpoint: `/api/transfers/send-batch`,
    },
  },
  notifications: {
    auth: {
      name: 'Notification Auth',
      endpoint: `/api/notifications/auth`,
    },
  },
};

export { endpoints };
export type { BaseEndpoint, AuthEndpoints, WalletEndpoints, ApiEndpoints };
