import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api/v1'),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  // JWT (Mobile)
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

  // JWT (Admin)
  ADMIN_JWT_SECRET: Joi.string().required(),
  ADMIN_JWT_EXPIRES_IN: Joi.string().default('1h'),
  ADMIN_JWT_REFRESH_SECRET: Joi.string().required(),
  ADMIN_JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // ElevenLabs
  ELEVENLABS_API_KEY: Joi.string().default(''),
  ELEVENLABS_AGENT_ID: Joi.string().default(''),

  // Gemini
  GEMINI_API_KEY: Joi.string().default(''),
  GEMINI_MODEL: Joi.string().default('gemini-2.0-flash'),

  // Razorpay
  RAZORPAY_KEY_ID: Joi.string().default(''),
  RAZORPAY_KEY_SECRET: Joi.string().default(''),
  RAZORPAY_WEBHOOK_SECRET: Joi.string().default(''),

  // Firebase
  FIREBASE_PROJECT_ID: Joi.string().default(''),
  FIREBASE_PRIVATE_KEY: Joi.string().default(''),
  FIREBASE_CLIENT_EMAIL: Joi.string().default(''),

  // Resend (Waitlist)
  RESEND_API_KEY: Joi.string().allow('').default(''),
  RESEND_AUDIENCE_ID: Joi.string().allow('').default(''),

  // Admin Seed
  ADMIN_DEFAULT_EMAIL: Joi.string().email().default('admin@yapsy.app'),

  // CORS
  CORS_ORIGINS: Joi.string().default(
    'http://localhost:3001,http://localhost:8080',
  ),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('debug', 'info', 'warn', 'error')
    .default('debug'),
});
