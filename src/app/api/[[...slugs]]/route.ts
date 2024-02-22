import { swagger } from '@elysiajs/swagger';
import { OAuth2RequestError } from 'arctic';
import { and, desc, eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import MeiliSearch from 'meilisearch';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { env } from '@/env';
import { github, lucia } from '@/lib/auth';
import { getRandomDefinition } from '@/lib/definitions';
import { generateId } from '@/lib/id';
import { termToSlug } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions, users, wotds } from '@/server/db/schema';
import type { GitHubEmailsResponse, GitHubUserResponse } from '@/types';

const app = new Elysia({ prefix: '/api' })
  .use(
    swagger({
      documentation: {
        info: {
          version: 'v1.0',
          title: 'DevTerms API',
          description:
            'A crowdsourced dictionary for developers. Find definitions for all sorts of technical terms, programming jargon, and more!'
        }
      },
      exclude: [
        '/api/callback/github',
        '/api/cron/meilisearch',
        '/api/cron/wotd'
      ]
    })
  )
  .onError(({ code }) => {
    if (code === 'NOT_FOUND') {
      return { success: false, error: 'not_found' };
    }
  })
  .onTransform(({ set }) => {
    set.headers['content-type'] = 'application/json';
  })
  .get(
    '/callback/github',
    async ({ query, cookie, set }) => {
      if (query.state !== cookie.oauth_state.get()) {
        set.status = 400;
        return { error: 'invalid_parameters' };
      }

      try {
        const tokens = await github.validateAuthorizationCode(query.code);
        const githubUserResponse = await fetch('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${tokens.accessToken}` }
        });
        const githubUser: GitHubUserResponse = await githubUserResponse.json();

        const existingUser = await db.query.users.findFirst({
          where: eq(users.githubId, githubUser.id)
        });

        if (existingUser) {
          const session = await lucia.createSession(existingUser.id, {});
          const sessionCookie = lucia.createSessionCookie(session.id);
          cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
          );
          set.redirect = '/';
          return;
        }

        let userEmail: string | null = githubUser.email;

        // Special case for GitHub accounts with private emails
        if (!userEmail) {
          const githubEmailsResponse = await fetch(
            'https://api.github.com/user/emails',
            { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
          );
          const githubEmails: GitHubEmailsResponse =
            await githubEmailsResponse.json();

          userEmail =
            githubEmails.find((email) => email.primary)?.email ??
            githubEmails.find((email) => email.verified)?.email ??
            null;

          if (!userEmail) {
            set.status = 400;
            return { error: 'missing_github_email' };
          }
        }

        const userId = generateId('user');

        await db.insert(users).values({
          id: userId,
          email: userEmail,
          name: githubUser.login,
          githubId: githubUser.id,
          avatar: githubUser.avatar_url
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );

        set.redirect = '/';
      } catch (err) {
        if (err instanceof OAuth2RequestError) {
          set.status = 400;
          return { error: 'invalid_code' };
        }
        console.error('GitHub OAuth2 error:', err);
        set.status = 500;
        return { error: 'internal_server_error' };
      }
    },
    {
      query: t.Object({ code: t.String(), state: t.String() }),
      cookie: t.Object({ oauth_state: t.String() })
    }
  )
  .group('/cron', (app) =>
    app.guard({ headers: t.Object({ authorization: t.String() }) }, (app) =>
      app
        .onBeforeHandle(({ set, headers: { authorization } }) => {
          if (authorization !== `Bearer ${env.CRON_SECRET}`) {
            set.status = 401;
            return { error: 'unauthorized' };
          }
        })
        .get('/meilisearch', async () => {
          const meili = new MeiliSearch({
            host: env.NEXT_PUBLIC_MEILISEARCH_HOST,
            apiKey: env.MEILISEARCH_MASTER_KEY
          });

          const data = await db.query.definitions.findMany({
            where: eq(definitions.status, 'approved'),
            columns: {
              id: true,
              term: true,
              definition: true,
              example: true
            }
          });

          const index = meili.index('definitions');
          index.updateSortableAttributes(['term']);
          await index.updateDocuments(data, { primaryKey: 'id' });
          return { success: true };
        })
        .get('/wotd', async ({ set }) => {
          const definition = await getRandomDefinition();
          if (!definition) {
            set.status = 500;
            return { error: 'no_definitions_available' };
          }
          await db.insert(wotds).values({ definitionId: definition.id });
          revalidateTag('wotd');
          return { success: true };
        })
    )
  )
  .group('/v1', (app) =>
    app
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
          upvotes: definition.upvotes,
          downvotes: definition.downvotes,
          createdAt: definition.createdAt,
          url: `https://devterms.io/define/${termToSlug(definition.term)}`
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
              url: `https://devterms.io/define/${termToSlug(result.term)}`
            }))
          };
        },
        { query: t.Object({ term: t.String() }) }
      )
  );

const handle = app.handle;

export { handle as GET, handle as POST };
