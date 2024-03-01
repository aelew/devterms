import { and, desc, eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';

import { env } from '@/env';
import { getRandomDefinition } from '@/lib/definitions';
import { termToSlug } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

export const publicRoutes = new Elysia({ prefix: '/v1' })
  .get('/health', () => ({ status: 'ok' }))
  .get('/random', async ({ set }) => {
    const definition = await getRandomDefinition();
    if (!definition) {
      set.status = 500;
      return { error: 'no_definitions_available' };
    }
    return {
      id: definition.id,
      term: definition.term,
      definition: definition.definition,
      url: `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(definition.term)}`
    };
  })
  .get(
    '/define',
    async ({ query }) => {
      const results = await db.query.definitions.findMany({
        orderBy: desc(definitions.upvotes),
        where: and(
          eq(definitions.status, 'approved'),
          eq(definitions.term, query.term)
        ),
        columns: {
          id: true,
          term: true,
          definition: true,
          upvotes: true,
          downvotes: true,
          createdAt: true
        }
      });
      return {
        results: results.map((result) => ({
          ...result,
          url: `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(result.term)}`
        }))
      };
    },
    { query: t.Object({ term: t.String() }) }
  );
