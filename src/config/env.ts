import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: (process.env.JWT_SECRET) as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  dbConfig: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  }
};

export type Config = typeof config;