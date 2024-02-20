import 'dotenv/config';

import { Client } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';

import { env } from '@/env';

const connection = new Client({ url: env.DATABASE_URL }).connection();
const db = drizzle(connection);

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
