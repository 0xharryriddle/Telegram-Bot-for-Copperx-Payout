# Command Reference

This document provides a comprehensive reference for all commands available in the CopperX Payout Telegram Bot.

## Basic Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/start` | Initializes the bot and displays the welcome message with main menu | `/start` |
| `/help` | Shows all available commands and their usage | `/help` |
| `/menu` | Displays the main menu with all available options | `/menu` |

## Authentication Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/login` | Initiates the login process with email | `/login example@email.com` |
| `/verifyotp` | Verifies the OTP sent to your email | `/verifyotp 123456` |
| `/setpassword` | Sets a password to protect your account | `/setpassword your_secure_password` |
| `/otp` | Requests a new OTP for login verification | `/otp` |
| `/logout` | Logs out from the current session | `/logout` |
| `/logoutall` | Logs out from all active sessions | `/logoutall` |

## Wallet Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/wallet` | Shows your wallet details and balances | `/wallet` |
| `/wallets` | Lists all your wallets | `/wallets` |
| `/balance` | Shows the balance of your default wallet | `/balance` |
| `/setdefaultwallet` | Sets a specific wallet as your default | `/setdefaultwallet wallet_id` |

## Transfer Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/send` | Initiates a transfer to another user | `/send email@example.com 0.001 BTC payment` |
| `/withdraw` | Initiates a withdrawal to your bank account | `/withdraw` |
| `/history` | Shows your transaction history | `/history` |
| `/pending` | Shows your pending transactions | `/pending` |

## Account Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/profile` | Displays your profile information | `/profile` |
| `/kyc` | Checks your KYC verification status | `/kyc` |
| `/support` | Connects you with customer support | `/support` |
| `/notification` | Manages your notification settings | `/notification` |

## Command Syntax Details

### Authentication Commands

#### `/login`
```
/login [email]
```
- **Purpose**: Authenticates with CopperX using your email address
- **Arguments**: 
  - `email` (optional): Your CopperX account email
- **Response**: If email is provided, initiates OTP verification. If not, prompts for email input
- **Example**: `/login user@example.com`

#### `/verifyotp`
```
/verifyotp [otp]
```
- **Purpose**: Verifies the one-time password sent to your email
- **Arguments**:
  - `otp` (optional): 6-digit verification code received via email
- **Response**: If valid, completes authentication process. If invalid, prompts for correct OTP
- **Example**: `/verifyotp 123456`

### Wallet Commands

#### `/wallet`
```
/wallet [wallet_id]
```
- **Purpose**: Displays wallet information and balance
- **Arguments**:
  - `wallet_id` (optional): Specific wallet ID to check
- **Response**: Shows wallet details including balance, currency, and recent transactions
- **Example**: `/wallet` or `/wallet abc123def456`

#### `/balance`
```
/balance [currency]
```
- **Purpose**: Checks balance of your default wallet
- **Arguments**:
  - `currency` (optional): Filter balance by specific currency
- **Response**: Displays current balance with currency breakdown
- **Example**: `/balance` or `/balance BTC`

### Transfer Commands

#### `/send`
```
/send [recipient] [amount] [currency] [purpose]
```
- **Purpose**: Transfers funds to another user
- **Arguments**:
  - `recipient`: Email address or wallet address of recipient
  - `amount`: Amount to transfer
  - `currency`: Currency code (BTC, ETH, USDT, etc.)
  - `purpose` (optional): Reason for the transfer
- **Response**: Confirmation prompt with transfer details
- **Example**: `/send user@example.com 0.01 BTC payment for services`

#### `/history`
```
/history [limit] [page]
```
- **Purpose**: Shows transaction history
- **Arguments**:
  - `limit` (optional): Number of transactions to show (default: 5)
  - `page` (optional): Page number for pagination (default: 1)
- **Response**: List of recent transactions with details
- **Example**: `/history 10 2` (shows transactions 11-20)

## Interactive Menu Commands

The bot also supports interactive menus that can be accessed without typing commands:

### Main Menu

- **💰 Wallet**: Access wallet management options
- **🔄 Transfer**: Access transfer options
- **👤 Account**: Access account settings
- **ℹ️ Help**: Get help and support

### Wallet Menu

- **View Wallets**: List all your wallets
- **Check Balance**: See your current balance
- **Set Default**: Choose your default wallet

### Transfer Menu

- **Send Funds**: Transfer to another user
- **Withdraw**: Withdraw to bank account
- **History**: View transaction history

### Account Menu

- **Profile**: View your profile information
- **KYC Status**: Check verification status
- **Settings**: Change account settings
- **Logout**: Sign out from your account

## Command Response Format

Most commands follow a consistent response format:

1. **Header**: Command name and status indicator
2. **Content**: Requested information or action confirmation
3. **Options**: Available actions or next steps
4. **Footer**: Help text or related commands

Example response for `/balance`:

```
💰 Wallet Balance

Current balance:
• 0.0012 BTC (≈ $75.36)
• 0.05 ETH (≈ $116.75)
• 150 USDT (≈ $150.00)

Total: ≈ $342.11

Use /send to transfer funds or /history to view transactions
```

## Error Handling

When commands fail, the bot provides helpful error messages:

| Error Type | Description | Example Message |
|------------|-------------|----------------|
| Authentication Error | User is not logged in | "You need to log in first. Use /login to authenticate" |
| Invalid Input | Incorrect command format | "Invalid input. Use /send recipient amount currency purpose" |
| Insufficient Funds | Not enough balance | "Insufficient funds. Your balance is 0.0005 BTC" |
| API Error | CopperX API issue | "Service temporarily unavailable. Please try again later" |
| Permission Error | User lacks permission | "You don't have permission to perform this action" |

## Command Limitations

- Transaction amounts are subject to platform limits
- Some commands require completed KYC verification
- Authentication tokens expire after 24 hours of inactivity
- Rate limiting applies to prevent abuse of commands

## Related Documentation

- [Setup Instructions](setup.md)
- [API Integration](api-integration.md)
- [Troubleshooting Guide](troubleshooting.md) 