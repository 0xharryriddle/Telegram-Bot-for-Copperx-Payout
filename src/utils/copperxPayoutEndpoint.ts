import { ENV } from '../configs';

interface BaseEndpoint {
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  auth: boolean;
}

// Auth endpoints interface
interface AuthEndpoints {
  emailOtpRequest: BaseEndpoint;
  emailOtpAuthenticate: BaseEndpoint;
  web3auth: BaseEndpoint;
  logout: BaseEndpoint;
  me: BaseEndpoint;
  pointsToken: BaseEndpoint;
  flags: BaseEndpoint;
  googleAuthenticate: BaseEndpoint;
}

// Personal Access Token endpoints interface
interface PersonalAccessTokenEndpoints {
  list: BaseEndpoint;
  create: BaseEndpoint;
  getById: BaseEndpoint;
  update: BaseEndpoint;
  delete: BaseEndpoint;
  regenerate: BaseEndpoint;
}

// Wallet endpoints interface
interface WalletEndpoints {
  list: BaseEndpoint;
  create: BaseEndpoint;
  getDefault: BaseEndpoint;
  setDefault: BaseEndpoint;
  getBalance: BaseEndpoint;
  getBalances: BaseEndpoint;
  getNetworks: BaseEndpoint;
  getTokenBalance: BaseEndpoint;
  recoverTokens: BaseEndpoint;
}

// Root endpoint interface
interface ApiEndpoints {
  base: BaseEndpoint;
  auth: AuthEndpoints;
  personalAccessTokens: PersonalAccessTokenEndpoints;
  wallets: WalletEndpoints;
}

const endpoints: ApiEndpoints = {
  base: {
    name: 'root',
    endpoint: `${ENV.BASE_URL}/`,
    method: 'GET',
    auth: false,
  },
  auth: {
    emailOtpRequest: {
      name: 'Email OTP Request',
      endpoint: `${ENV.BASE_URL}/auth/email-otp/request`,
      method: 'POST',
      auth: false,
    },
    emailOtpAuthenticate: {
      name: 'Email OTP Authenticate',
      endpoint: `${ENV.BASE_URL}/auth/email-otp/authenticate`,
      method: 'POST',
      auth: false,
    },
    web3auth: {
      name: 'Web3 Authentication',
      endpoint: `${ENV.BASE_URL}/auth/web3auth/authenticate`,
      method: 'POST',
      auth: false,
    },
    logout: {
      name: 'Logout',
      endpoint: `${ENV.BASE_URL}/auth/logout`,
      method: 'POST',
      auth: true,
    },
    me: {
      name: 'Get User Info',
      endpoint: `${ENV.BASE_URL}/auth/me`,
      method: 'GET',
      auth: true,
    },
    pointsToken: {
      name: 'Points Token',
      endpoint: `${ENV.BASE_URL}/auth/points-token`,
      method: 'POST',
      auth: true,
    },
    flags: {
      name: 'Update Flags',
      endpoint: `${ENV.BASE_URL}/auth/flags`,
      method: 'PUT',
      auth: true,
    },
    googleAuthenticate: {
      name: 'Google Authentication',
      endpoint: `${ENV.BASE_URL}/auth/google/authenticate`,
      method: 'POST',
      auth: false,
    },
  },
  personalAccessTokens: {
    list: {
      name: 'List Tokens',
      endpoint: `${ENV.BASE_URL}/personal-access-tokens`,
      method: 'GET',
      auth: true,
    },
    create: {
      name: 'Create Token',
      endpoint: `${ENV.BASE_URL}/personal-access-tokens`,
      method: 'POST',
      auth: true,
    },
    getById: {
      name: 'Get Token',
      endpoint: `${ENV.BASE_URL}/personal-access-tokens/{id}`,
      method: 'GET',
      auth: true,
    },
    update: {
      name: 'Update Token',
      endpoint: `${ENV.BASE_URL}/personal-access-tokens/{id}`,
      method: 'PUT',
      auth: true,
    },
    delete: {
      name: 'Delete Token',
      endpoint: `${ENV.BASE_URL}/personal-access-tokens/{id}`,
      method: 'DELETE',
      auth: true,
    },
    regenerate: {
      name: 'Regenerate Token',
      endpoint: `${ENV.BASE_URL}/personal-access-tokens/{id}/regenerate`,
      method: 'POST',
      auth: true,
    },
  },
  wallets: {
    list: {
      name: 'List Wallets',
      endpoint: `${ENV.BASE_URL}/wallets`,
      method: 'GET',
      auth: true,
    },
    create: {
      name: 'Create Wallet',
      endpoint: `${ENV.BASE_URL}/wallets`,
      method: 'POST',
      auth: true,
    },
    getDefault: {
      name: 'Get Default Wallet',
      endpoint: `${ENV.BASE_URL}/wallets/default`,
      method: 'GET',
      auth: true,
    },
    setDefault: {
      name: 'Set Default Wallet',
      endpoint: `${ENV.BASE_URL}/wallets/default`,
      method: 'POST',
      auth: true,
    },
    getBalance: {
      name: 'Get Balance',
      endpoint: `${ENV.BASE_URL}/wallets/balance`,
      method: 'GET',
      auth: true,
    },
    getBalances: {
      name: 'Get All Balances',
      endpoint: `${ENV.BASE_URL}/wallets/balances`,
      method: 'GET',
      auth: true,
    },
    getNetworks: {
      name: 'Get Networks',
      endpoint: `${ENV.BASE_URL}/wallets/networks`,
      method: 'GET',
      auth: true,
    },
    getTokenBalance: {
      name: 'Get Token Balance',
      endpoint: `${ENV.BASE_URL}/wallets/{chainId}/tokens/{token}/balance`,
      method: 'GET',
      auth: true,
    },
    recoverTokens: {
      name: 'Recover Tokens',
      endpoint: `${ENV.BASE_URL}/wallets/recover-tokens`,
      method: 'POST',
      auth: true,
    },
  },
};

export { endpoints };
export type {
  BaseEndpoint,
  AuthEndpoints,
  PersonalAccessTokenEndpoints,
  WalletEndpoints,
  ApiEndpoints,
};
