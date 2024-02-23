import { eq, sql } from 'drizzle-orm';

import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

export const CATEGORIES = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'new'
];

export async function getRandomDefinition() {
  return db.query.definitions.findFirst({
    where: eq(definitions.status, 'approved'),
    orderBy: sql`rand()`
  });
}
