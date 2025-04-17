import { env } from './env';

// Parse Redis URL if available
const parseRedisUrl = (url: string) => {
  try {
    if (!url) return null;
    
    const regex = /redis:\/\/(?:(.+):(.*)@)?([^:]+)(?::(\d+))?/;
    const matches = url.match(regex);
    
    if (!matches) return null;
    
    return {
      host: matches[3] || 'localhost',
      port: parseInt(matches[4] || '6379', 10),
      username: matches[1] || undefined,
      password: matches[2] || undefined,
    };
  } catch (error) {
    console.error('Error parsing Redis URL:', error);
    return null;
  }
};

const redisConfig = env.REDIS_URL ? parseRedisUrl(env.REDIS_URL) : null;

// Configuration object
const config = {
  server: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
    clientUrl: env.CLIENT_URL,
  },
  
  db: {
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASS,
    host: env.DB_HOST,
    port: env.DB_PORT,
  },
  
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiry: '24h',
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  
  stripe: {
    secretKey: env.STRIPE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  
  redis: {
    enabled: !!redisConfig,
    host: redisConfig?.host || 'localhost',
    port: redisConfig?.port || 6379,
    username: redisConfig?.username,
    password: redisConfig?.password,
  },
  
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    fromEmail: env.SMTP_FROM_EMAIL,
    fromName: env.SMTP_FROM_NAME,
  },
};

export default config; 