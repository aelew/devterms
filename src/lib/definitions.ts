import { eq, sql } from 'drizzle-orm';

import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

export async function getRandomDefinition() {
  return db.query.definitions.findFirst({
    where: eq(definitions.status, 'approved'),
    orderBy: sql`rand()`
  });
}
