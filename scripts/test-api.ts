// import express from 'express';
// import bodyParser from 'body-parser';
// import * as Configs from '../src/configs';
// import '../src/databases/init.mongodb';
// import { AuthService } from '../api/services/auth.service';
// import { WalletService } from '../api/services/wallet.service';
// import { TransferService } from '../api/services/transfer.service';
// import { NotificationService } from '../api/services/notification.service';

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Services
// const authService = new AuthService();
// const walletService = new WalletService();
// const transferService = new TransferService();
// const notificationService = new NotificationService();

// // Test routes
// app.get('/', (req, res) => {
//   res.send('Copperx Payout API Test Server');
// });

// // Auth routes
// app.post('/auth/request-otp', async (req, res) => {
//   const { email, telegramId } = req.body;
//   if (!email || !telegramId) {
//     return res.status(400).json({ success: false, message: 'Email and telegramId are required' });
//   }
  
//   const result = await authService.emailOtpRequest(email, parseInt(telegramId));
//   res.json(result);
// });

// app.post('/auth/verify-otp', async (req, res) => {
//   const { telegramId, otp } = req.body;
//   if (!telegramId || !otp) {
//     return res.status(400).json({ success: false, message: 'TelegramId and OTP are required' });
//   }
  
//   const result = await authService.verifyOtp(parseInt(telegramId), otp);
//   res.json(result);
// });

// app.get('/auth/profile/:telegramId', async (req, res) => {
//   const telegramId = parseInt(req.params.telegramId);
//   if (!telegramId) {
//     return res.status(400).json({ success: false, message: 'TelegramId is required' });
//   }
  
//   const result = await authService.getUserProfile(telegramId);
//   res.json(result);
// });

// app.get('/auth/kyc/:telegramId', async (req, res) => {
//   const telegramId = parseInt(req.params.telegramId);
//   if (!telegramId) {
//     return res.status(400).json({ success: false, message: 'TelegramId is required' });
//   }
  
//   const result = await authService.getKYCStatus(telegramId);
//   res.json(result);
// });

// app.post('/auth/logout', async (req, res) => {
//   const { telegramId } = req.body;
//   if (!telegramId) {
//     return res.status(400).json({ success: false, message: 'TelegramId is required' });
//   }
  
//   const result = await authService.logout(parseInt(telegramId));
//   res.json(result);
// });

// // Wallet routes
// app.get('/wallets/:telegramId', async (req, res) => {
//   const telegramId = parseInt(req.params.telegramId);
//   if (!telegramId) {
//     return res.status(400).json({ success: false, message: 'TelegramId is required' });
//   }
  
//   const result = await walletService.getWallets(telegramId);
//   res.json(result);
// });

// app.get('/wallets/balances/:telegramId', async (req, res) => {
//   const telegramId = parseInt(req.params.telegramId);
//   if (!telegramId) {
//     return res.status(400).json({ success: false, message: 'TelegramId is required' });
//   }
  
//   const result = await walletService.getWalletBalances(telegramId);
//   res.json(result);
// });

// app.get('/wallets/default/:telegramId', async (req, res) => {
//   const telegramId = parseInt(req.params.telegramId);
//   if (!telegramId) {
//     return res.status(400).json({ success: false, message: 'TelegramId is required' });
//   }
  
//   const result = await walletService.getDefaultWallet(telegramId);
//   res.json(result);
// });

// app.post('/wallets/default', async (req, res) => {
//   const { telegramId, walletId } = req.body;
//   if (!telegramId || !walletId) {
//     return res.status(400).json({ success: false, message: 'TelegramId and walletId are required' });
//   }
  
//   const result = await walletService.setDefaultWallet(parseInt(telegramId), walletId);
//   res.json(result);
// });

// // Transfer routes
// app.get('/transfers/:telegramId', async (req, res) => {
//   const telegramId = parseInt(req.params.telegramId);
//   const page = req.query.page ? parseInt(req.query.page as string) : 1;
//   const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  
//   if (!telegramId) {
//     return res.status(400).json({ success: false, message: 'TelegramId is required' });
//   }
  
//   const result = await transferService.getTransactionHistory(telegramId, page, limit);
//   res.json(result);
// });

// app.post('/transfers/send-email', async (req, res) => {
//   const { telegramId, email, amount, currency, message } = req.body;
//   if (!telegramId || !email || !amount || !currency) {
//     return res.status(400).json({ success: false, message: 'TelegramId, email, amount, and currency are required' });
//   }
  
//   const result = await transferService.sendFundsToEmail(parseInt(telegramId), email, parseFloat(amount), currency, message);
//   res.json(result);
// });

// app.post('/transfers/send-wallet', async (req, res) => {
//   const { telegramId, address, amount, currency, network } = req.body;
//   if (!telegramId || !address || !amount || !currency || !network) {
//     return res.status(400).json({ success: false, message: 'TelegramId, address, amount, currency, and network are required' });
//   }
  
//   const result = await transferService.sendFundsToWallet(parseInt(telegramId), address, parseFloat(amount), currency, network);
//   res.json(result);
// });

// app.post('/transfers/withdraw-bank', async (req, res) => {
//   const { telegramId, amount, currency } = req.body;
//   if (!telegramId || !amount || !currency) {
//     return res.status(400).json({ success: false, message: 'TelegramId, amount, and currency are required' });
//   }
  
//   const result = await transferService.withdrawToBank(parseInt(telegramId), parseFloat(amount), currency);
//   res.json(result);
// });

// // Notification routes
// app.post('/notifications/auth', async (req, res) => {
//   const { telegramId, socket_id, channel_name } = req.body;
//   if (!telegramId || !socket_id || !channel_name) {
//     return res.status(400).json({ success: false, message: 'TelegramId, socket_id, and channel_name are required' });
//   }
  
//   const result = await notificationService.authenticatePusher(parseInt(telegramId), socket_id, channel_name);
//   res.json(result);
// });

// app.get('/notifications/config', (req, res) => {
//   const config = notificationService.getPusherConfig();
//   res.json({ success: true, config });
// });

// // Start server
// app.listen(port, () => {
//   console.log(`API test server running at http://localhost:${port}`);
// }); 