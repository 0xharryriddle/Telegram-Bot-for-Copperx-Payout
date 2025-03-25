// import { Bot } from './bot';
// import * as Configs from '../configs';
// import mongoose from 'mongoose';

// class Api {
//   private bot: Bot;

//   constructor() {
//     this.bot = new Bot();
//   }

//   async connectDatabase() {
//     try {
//       await mongoose.connect(Configs.ENV.MONGO_URI);
//       Configs.logger.info('Connected to MongoDB');
//       return true;
//     } catch (error) {
//       Configs.logger.error('Failed to connect to MongoDB', { error });
//       return false;
//     }
//   }

//   async start() {
//     try {
//       // Connect to database
//       const dbConnected = await this.connectDatabase();
//       if (!dbConnected) {
//         Configs.logger.error(
//           'API initialization failed: Database connection error',
//         );
//         return false;
//       }

//       // Start the bot
//       const botStarted = await this.bot.launch();
//       if (!botStarted) {
//         Configs.logger.error('API initialization failed: Bot launch error');
//         return false;
//       }

//       Configs.logger.info('API started successfully');
//       return true;
//     } catch (error) {
//       Configs.logger.error('API initialization failed', { error });
//       return false;
//     }
//   }
// }

// // Initialize and start the API
// const api = new Api();
// api.start().catch((error) => {
//   Configs.logger.error('Failed to start API', { error });
//   process.exit(1);
// });
