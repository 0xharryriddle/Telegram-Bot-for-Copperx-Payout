# CopperX Payout Telegram Bot

🚀 **CopperX Payout Telegram Bot** is a webhook-based Telegram bot that enables seamless crypto transactions and wallet management using the CopperX API. This bot provides features like balance checking, fund transfers, transaction history, and authentication.

## 📌 Features

* ✅ Secure authentication via CopperX API
* 💰 Check wallet balances
* 🔄 View transaction history
* 💸 Send funds to email or wallet addresses
* 🏦 Withdraw funds to bank accounts
* 🛡️ Password-protected authentication
* 🎛️ Interactive menus for easy navigation
* 📡 Webhook-based for real-time updates

## 📚 Documentation

Comprehensive documentation is available in the `docs` folder:

* [Setup Instructions](docs/setup.md) - How to install and configure the bot
* [API Integration](docs/api-integration.md) - Details on how the bot interacts with CopperX API
* [Command Reference](docs/commands.md) - All available bot commands and their usage
* [Troubleshooting Guide](docs/troubleshooting.md) - Solutions to common issues

## 🏗️ Project Structure

```
src/
├── api/              # API integration services
│   ├── services/     # Service classes for API calls
│   └── types/        # TypeScript types for API
├── commands/         # Bot command handlers
├── configs/          # Configuration files
├── contexts/         # Telegram context definitions
├── handlers/         # Message and event handlers
├── menus/            # Interactive UI menus
│   ├── account.menu.ts
│   ├── transfer.menu.ts
│   ├── wallet.menu.ts
│   └── index.ts
├── routes/           # Command routing
├── utils/            # Utility functions
└── webhook.ts        # Main webhook server
```

## 🔧 Quick Start

### **1️⃣ Clone the repository**

```bash
git clone https://github.com/prospercoded/copperx-payout-bot.git
cd copperx-payout-bot
```

### **2️⃣ Install dependencies**

```bash
npm install
```

### **3️⃣ Set up environment variables**

Create a `.env` file and add:

```
BOT_TOKEN=your_telegram_bot_token
SERVER_URL=https://your-server-url.com
```

### **4️⃣ Run the server**

#### Development mode:

```bash
npm run dev
```

#### Production mode:

```bash
npm run build
npm run start
```

For detailed setup instructions, see the [Setup Guide](docs/setup.md).

## 📡 Using the Bot

### **Start the Bot**

Send `/start` to the bot to begin and see the main menu.

### **Authentication**

Use `/login` to authenticate with CopperX. You'll receive an OTP verification code by email.

### **Check Wallet Balance**

Use `/wallet` or the Wallet menu to check your balances.

### **Transfer Funds**

Use `/send` or the Transfer menu to send funds to email or wallet addresses.

See the [Command Reference](docs/commands.md) for a complete list of commands.

## 🛠️ Interactive Menus

The bot features an intuitive, interactive menu system:

- 💰 **Wallet Menu**: View wallets, check balance, set default wallet
- 🔄 **Transfer Menu**: Send funds, view history, withdraw
- 👤 **Account Menu**: Login, profile, KYC status, logout

## 🚀 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature-xyz`)
3. Commit changes (`git commit -m 'Add feature XYZ'`)
4. Push to the branch (`git push origin feature-xyz`)
5. Create a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For support, reach out via:

* **Telegram**: @prospercoded
* **Email**: buildminds.direct@gmail.com
