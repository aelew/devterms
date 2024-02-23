import { Client } from '@planetscale/database';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';

dotenv.config({ path: ['.env', '.env.local'] });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const client = new Client({ url: process.env.DATABASE_URL });
const db = drizzle(client);

async function main() {
  try {
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
    console.log('Tables migrated!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to perform migration:', err);
    process.exit(1);
  }
}

void main();
