import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { and, desc, eq, sql } from 'drizzle-orm';
import MeiliSearch from 'meilisearch';
import { z } from 'zod';

import { env } from '@/env';
import { getRandomDefinition } from '@/lib/definitions';
import { termToSlug } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';
import type { DefinitionHit } from '@/types';

export const publicRoutes = new OpenAPIHono()
  .openapi(
    createRoute({
      method: 'get',
      path: '/health',
      responses: {
        200: {
          description:
            'Simple health check endpoint for uptime monitoring services.',
          content: {
            'application/json': {
              schema: z.object({
                status: z.literal('ok')
              })
            }
          }
        }
      }
    }),
    (c) => c.json({ status: 'ok' } as const)
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/random',
      responses: {
        200: {
          description: 'Returns a random definition from DevTerms.',
          content: {
            'application/json': {
              schema: z.object({
                id: z.string(),
                term: z.string(),
                definition: z.string(),
                example: z.string(),
                url: z.string().url()
              })
            }
          }
        },
        404: {
          description: 'Not found',
          content: {
            'application/json': {
              schema: z.object({
                success: z.literal(false),
                error: z.string()
              })
            }
          }
        }
      }
    }),
    async (c) => {
      const definition = await getRandomDefinition();
      if (!definition) {
        return c.json(
          {
            success: false,
            error: 'no_definitions_available'
          } as const,
          404
        );
      }
      return c.json(
        {
          ...definition,
          url: `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(definition.term)}`
        },
        200
      );
    }
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/search',
      request: {
        query: z.object({
          q: z.string(),
          page: z.number().default(1).optional()
        })
      },
      responses: {
        200: {
          description:
            'Uses fuzzy string matching to search for definitions. This should produce equivalent results to the search bar on the website. Returns a list of hits and other metadata.',
          content: {
            'application/json': {
              schema: z.object({
                query: z.string(),
                page: z.number(),
                hitsPerPage: z.number(),
                totalPages: z.number(),
                totalHits: z.number(),
                processingTimeMs: z.number(),
                hits: z.array(
                  z.object({
                    id: z.string(),
                    term: z.string(),
                    definition: z.string(),
                    example: z.string(),
                    url: z.string().url()
                  })
                )
              })
            }
          }
        }
      }
    }),
    async (c) => {
      const { q: query, page } = c.req.valid('query');

      const meili = new MeiliSearch({
        host: env.NEXT_PUBLIC_MEILISEARCH_HOST,
        apiKey: env.MEILISEARCH_MASTER_KEY
      });

      const index = meili.index<DefinitionHit>('definitions');

      const response = await index.search(query, {
        attributesToSearchOn: ['term', 'definition', 'example'],
        hitsPerPage: 4,
        page
      });

      return c.json({
        ...response,
        hits: response.hits.map((hit) => ({
          ...hit,
          url: `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(hit.term)}`
        }))
      });
    }
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/define',
      request: {
        query: z
          .object({
            id: z.string(),
            term: z.string()
          })
          .partial()
      },
      responses: {
        200: {
          description:
            'Returns a single definition by its ID or definition(s) by exact term. Use the `/search` endpoint for fuzzy matching.',
          content: {
            'application/json': {
              schema: z.object({
                results: z.array(
                  z.object({
                    id: z.string(),
                    term: z.string(),
                    definition: z.string(),
                    upvotes: z.number(),
                    downvotes: z.number(),
                    createdAt: z.number(),
                    url: z.string().url()
                  })
                )
              })
            }
          }
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: z.object({
                success: z.literal(false),
                error: z.string()
              })
            }
          }
        }
      }
    }),
    async (c) => {
      const query = c.req.valid('query');
      if (!query.id && !query.term) {
        return c.json(
          {
            success: false,
            error: 'invalid_query'
          } as const,
          400
        );
      }

      const results = await db.query.definitions.findMany({
        orderBy: desc(definitions.upvotes),
        where: and(
          eq(definitions.status, 'approved'),
          query.id
            ? eq(definitions.id, query.id)
            : eq(definitions.term, sql`${query.term} COLLATE NOCASE`)
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

      return c.json(
        {
          results: results.map((result) => ({
            ...result,
            url: `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(result.term)}`
          }))
        },
        200
      );
    }
  );
