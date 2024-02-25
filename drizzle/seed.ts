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

const client = new Client({ url: process.env.DATABASE_URL });
const db = drizzle(client, { schema });

const AUTHOR_ID = 'user_0y3hmvftKAtzgtFp';

interface SeedDefinition {
  term: string;
  definition: string;
  example: string;
}

async function main() {
  try {
    const filePath = __dirname + '/definitions.json';
    const fileContent = await readFile(filePath, 'utf-8');
    const seedDefinitionArray = JSON.parse(fileContent) as SeedDefinition[];

    console.log(
      'Seeding database with',
      seedDefinitionArray.length,
      'definitions'
    );

    for (let i = 0; i < seedDefinitionArray.length; i++) {
      const definition = seedDefinitionArray[i]!;
      await db.insert(schema.definitions).values({
        userId: AUTHOR_ID,
        status: 'approved',
        upvotes: 1,
        ...definition
      });
      console.log('Seed progress:', `${(i + 1)}/${seedDefinitionArray.length}`, '|', definition.term);
    }

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed:', err);
    process.exit(1);
  }
}

void main();
