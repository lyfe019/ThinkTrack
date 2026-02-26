// src/config/index.ts
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

interface Config {
  env: string;
  port: number;
  host: string;
  logLevel: string;
  api: {
    prefix: string;
    secret: string; // Added this to the interface
  };
}

const _config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  logLevel: process.env.LOG_LEVEL || 'info',
  api: {
    prefix: '/api/v1',
    // High Serious: Use env variable or a fallback for local development
    secret: process.env.JWT_SECRET || 'high_serious_default_secret_key',
  },
};

// High Serious Validation: Ensure critical variables exist for production
const requiredVars: string[] = []; 

if (_config.env === 'production') {
  requiredVars.push('JWT_SECRET');
}

requiredVars.forEach((v) => {
  if (!process.env[v]) {
    throw new Error(`Configuration Error: Missing ENV variable ${v}`);
  }
});

export const config = Object.freeze(_config);