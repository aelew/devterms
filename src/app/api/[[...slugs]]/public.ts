import { and, desc, eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import MeiliSearch from 'meilisearch';

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
      throw new Error('No definitions available');
    }
    return {
      id: definition.id,
      term: definition.term,
      definition: definition.definition,
      url: `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(definition.term)}`
    };
  })
  .get(
    '/search',
    async ({ query: { q: query, page } }) => {
      const meili = new MeiliSearch({
        host: env.NEXT_PUBLIC_MEILISEARCH_HOST,
        apiKey: env.MEILISEARCH_MASTER_KEY
      });

      const index = meili.index('definitions');
      const response = await index.search(query, {
        attributesToSearchOn: ['term', 'definition', 'example'],
        hitsPerPage: 4,
        page
      });

      return {
        ...response,
        hits: response.hits.map((hit) => ({
          ...hit,
          url: `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(hit.term)}`
        }))
      };
    },
    {
      query: t.Object({
        q: t.String(),
        page: t.Optional(t.Numeric({ minimum: 1 }))
      })
    }
  )
  .get(
    '/define',
    async ({ query, set }) => {
      if (!query.id && !query.term) {
        set.status = 400;
        throw new Error('Please specify a term or definition ID');
      }

      const results = await db.query.definitions.findMany({
        orderBy: desc(definitions.upvotes),
        where: and(
          eq(definitions.status, 'approved'),
          query.id
            ? eq(definitions.id, query.id)
            : eq(definitions.term, query.term!)
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
    {
      query: t.Partial(
        t.Object({
          id: t.String(),
          term: t.String()
        })
      )
    }
  );
