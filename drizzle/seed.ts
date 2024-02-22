import { readFile } from 'fs/promises';
import { webcrypto } from 'node:crypto';
import { Client } from '@planetscale/database';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

import * as schema from '@/server/db/schema';

globalThis.crypto = webcrypto as Crypto;

dotenv.config({ path: ['.env', '.env.local'] });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const connection = new Client({ url: process.env.DATABASE_URL }).connection();
const db = drizzle(connection, { schema });

const AUTHOR_ID = 'user_sys';

interface SeedDefinition {
  term: string;
  definition: string;
  example: string;
}

async function main() {
  try {
    const filePath = __dirname + '/definitions.json';
    const fileContent = await readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent) as SeedDefinition[];

    console.log('Seeding database with', data.length, 'definitions');

    for (const def of data) {
      await db.insert(schema.definitions).values({
        userId: AUTHOR_ID,
        status: 'approved',
        upvotes: 1,
        ...def
      });
    }

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed:', err);
    process.exit(1);
  }
}

void main();
