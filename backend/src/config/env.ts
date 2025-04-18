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
  API_URL: process.env.API_URL || 'http://localhost:5000',
  FASTAPI_URL: process.env.FASTAPI_URL!,
  
  // Google OAuth settings
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  
  // Mail settings for password reset
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'noreply@crownking.com',
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'CrownKing',
}; 