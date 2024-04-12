import { readFile } from 'fs/promises';
import { createClient } from '@libsql/client/web';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '@/server/db/schema';

dotenv.config({ path: ['.env', '.env.local'] });

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Turso environment variables are not set');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const db = drizzle(client, { schema });

const AUTHOR_ID = 'user_SvltYFQtlIZvYJKo';

interface SeedDefinition {
  term: string;
  definition: string;
  example: string;
}

async function main() {
  try {
    const filePath = __dirname + '/definitions.json';
    const fileContent = await readFile(filePath, 'utf-8');
    const seedDefinitions = JSON.parse(fileContent) as SeedDefinition[];

    console.log(`Seeding database with ${seedDefinitions.length} definitions`);

    for (let i = 0; i < seedDefinitions.length; i++) {
      const definition = seedDefinitions[i]!;
      await db.insert(schema.definitions).values({
        userId: AUTHOR_ID,
        status: 'approved',
        upvotes: 1,
        ...definition
      });
      console.log(
        `Seed progress: ${i + 1}/${seedDefinitions.length} | ${definition.term}`
      );
    }

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

void main();
