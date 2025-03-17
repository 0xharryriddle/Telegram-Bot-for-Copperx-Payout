import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z
    .string()
    .transform(Number)
    .refine((n) => n >= 1024 && n <= 65535, {
      message: 'Port must be between 1024 and 65535',
    }),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  BASE_URL: z.string().url(),
  BOT_TOKEN: z.string(),
  MONGO_URI: z.string(),
  REDIS_URL: z.string(),
  PUSHER_APP_ID: z.string(),
  PUSHER_KEY: z.string(),
  PUSHER_SECRET: z.string(),
  PUSHER_CLUSTER: z.string(),
});

export const ENV = envSchema.parse(process.env);

// Add validation for production environment
if (process.env.NODE_ENV === 'production') {
  const requiredFields = ['BOT_TOKEN', 'BASE_URL', 'MONGO_URI', 'REDIS_URL', 'PUSHER_APP_ID', 'PUSHER_KEY', 'PUSHER_SECRET', 'PUSHER_CLUSTER'];

  requiredFields.forEach((field) => {
    if (!process.env[field]) {
      throw new Error(`Missing required env variable: ${field}`);
    }
  });
}
