import { createClient } from '@libsql/client/web';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

dotenv.config({ path: ['.env', '.env.local'] });

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Turso environment variables are not set');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const db = drizzle(client);

async function main() {
  try {
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
    console.log('Tables migrated!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

void main();
