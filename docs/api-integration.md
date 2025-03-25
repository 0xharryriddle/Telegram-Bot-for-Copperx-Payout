# API Integration Guide

This document outlines how the CopperX Payout Telegram Bot integrates with the CopperX API to provide various services and functionalities.

## API Architecture

The bot uses a service-based architecture to communicate with the CopperX API:

```
src/api/
├── services/           # Service classes for different API endpoints
│   ├── auth.service.ts # Authentication related API calls
│   ├── wallet.service.ts # Wallet operations
│   ├── transfer.service.ts # Fund transfers
│   └── notification.service.ts # Real-time notifications
├── types/              # TypeScript types for API requests/responses
└── databases/          # Database connections (Redis, MongoDB)
```

## Authentication

### Login Flow

1. User initiates login with an email address
2. Bot sends request to CopperX API for OTP generation
3. User receives OTP via email and submits it to the bot
4. Bot verifies OTP with CopperX API
5. Upon successful verification, API returns authentication tokens
6. Tokens are stored securely for subsequent API calls

```typescript
// Example authentication flow
async function loginWithEmail(email: string): Promise<AuthResponse> {
  // Request OTP to be sent to user's email
  const otpResponse = await api.post('/auth/request-otp', { email });
  
  // Return response to bot for further processing
  return otpResponse.data;
}

async function verifyOtp(email: string, otp: string): Promise<AuthTokens> {
  // Verify the OTP provided by user
  const verifyResponse = await api.post('/auth/verify-otp', { 
    email, 
    otp 
  });
  
  // Store tokens securely
  const { accessToken, refreshToken } = verifyResponse.data;
  await tokenStorage.saveTokens(email, accessToken, refreshToken);
  
  return verifyResponse.data;
}
```

## Wallet Operations

### Retrieving Wallet Information

The bot communicates with the CopperX API to fetch wallet details, balances, and transaction history.

```typescript
// Example wallet balance retrieval
async function getWalletBalances(userId: string): Promise<WalletBalanceDto[]> {
  const authToken = await tokenStorage.getAccessToken(userId);
  
  const response = await api.get('/wallets/balances', {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  
  return response.data;
}
```

### Setting Default Wallet

Users can set a preferred wallet for transactions:

```typescript
async function setDefaultWallet(userId: string, walletId: string): Promise<boolean> {
  const authToken = await tokenStorage.getAccessToken(userId);
  
  await api.post('/wallets/default', {
    walletId
  }, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  
  return true;
}
```

## Transfer Operations

### Sending Funds

The bot allows users to send funds to email addresses or wallet addresses:

```typescript
async function sendFunds(userId: string, transferData: TransferDto): Promise<TransferResponse> {
  const authToken = await tokenStorage.getAccessToken(userId);
  
  const response = await api.post('/transfers/send', transferData, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  
  return response.data;
}
```

### Transaction History

The bot can retrieve and display transaction history:

```typescript
async function getTransactionHistory(
  userId: string, 
  page: number = 1, 
  limit: number = 10
): Promise<TransactionHistoryResponse> {
  const authToken = await tokenStorage.getAccessToken(userId);
  
  const response = await api.get('/transfers/history', {
    params: {
      page,
      limit
    },
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  
  return response.data;
}
```

## Real-time Notifications

The bot uses Pusher for real-time notifications of deposits and other account activities.

### Pusher Integration

```typescript
import Pusher from 'pusher-js';

// Initialize Pusher client
const pusher = new Pusher(PUSHER_KEY, {
  cluster: PUSHER_CLUSTER,
  encrypted: true
});

// Subscribe to user's channel
function subscribeToUserNotifications(userId: string, telegramId: number) {
  const channel = pusher.subscribe(`private-user-${userId}`);
  
  // Listen for deposit events
  channel.bind('deposit', (data: DepositNotification) => {
    notifyUser(telegramId, formatDepositMessage(data));
  });
  
  // Listen for withdrawal events
  channel.bind('withdrawal', (data: WithdrawalNotification) => {
    notifyUser(telegramId, formatWithdrawalMessage(data));
  });
}
```

## Error Handling

The bot implements comprehensive error handling for API interactions:

```typescript
try {
  const result = await apiService.performAction();
  // Process successful result
} catch (error) {
  if (error.response) {
    // The API responded with an error status code
    const statusCode = error.response.status;
    const errorData = error.response.data;
    
    switch (statusCode) {
      case 401:
        // Handle authentication error
        await refreshTokenAndRetry();
        break;
      case 403:
        // Handle permission error
        notifyUserOfPermissionIssue();
        break;
      case 404:
        // Handle resource not found
        notifyUserOfMissingResource();
        break;
      default:
        // Handle other API errors
        logErrorAndNotifyUser(errorData);
    }
  } else if (error.request) {
    // The request was made but no response received
    notifyUserOfConnectionIssue();
  } else {
    // Something else went wrong
    logErrorAndNotifyUser(error.message);
  }
}
```

## Rate Limiting

The bot respects the CopperX API rate limits and implements exponential backoff for retries:

```typescript
async function sendRequestWithRetry(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await api.request({ url, ...options });
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Rate limited, calculate backoff time
        const backoffTime = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        retries++;
      } else {
        // Different error, don't retry
        throw error;
      }
    }
  }
  
  throw new Error('Maximum retry attempts reached');
}
```

## Security Considerations

1. **Token Storage**: Access tokens are stored securely and never exposed to users
2. **HTTPS**: All API communications occur over HTTPS
3. **Token Refresh**: The bot automatically refreshes expired tokens
4. **Data Validation**: All user inputs are validated before being sent to the API
5. **Error Sanitization**: API error messages are sanitized before being shown to users

## Related Documentation

- [CopperX API Documentation](https://docs.copperx.io/api) - Official API reference
- [Pusher Documentation](https://pusher.com/docs) - For real-time notification integration 