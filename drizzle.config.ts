import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({ path: ['.env', '.env.local'] });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default {
  driver: 'mysql2',
  out: 'drizzle/migrations',
  schema: 'src/server/db/schema.ts',
  dbCredentials: { uri: process.env.DATABASE_URL }
} satisfies Config;
