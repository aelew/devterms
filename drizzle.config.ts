import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({ path: ['.env', '.env.local'] });

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Turso environment variables are not set');
}

export default {
  driver: 'turso',
  dialect: 'sqlite',
  out: 'drizzle/migrations',
  schema: './src/server/db/schema.ts',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  }
} satisfies Config;
