import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASS: process.env.DB_PASS!,
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  JWT_SECRET: process.env.JWT_SECRET!,
  STRIPE_KEY: process.env.STRIPE_SECRET_KEY!,
  REDIS_URL: process.env.REDIS_URL!,
  CLIENT_URL: process.env.CLIENT_URL!,
  FASTAPI_URL: process.env.FASTAPI_URL!,
}; 