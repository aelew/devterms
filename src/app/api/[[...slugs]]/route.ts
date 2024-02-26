import { swagger } from '@elysiajs/swagger';
import { OAuth2RequestError } from 'arctic';
import { and, desc, eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import MeiliSearch from 'meilisearch';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { TwitterApi } from 'twitter-api-v2';

import { env } from '@/env';
import { github, lucia } from '@/lib/auth';
import { getRandomDefinition } from '@/lib/definitions';
import { generateId } from '@/lib/id';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/seo';
import { termToSlug } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions, users, wotds } from '@/server/db/schema';
import type { GitHubEmailsResponse, GitHubUserResponse } from '@/types';

const TWITTER_CALLBACK_URL = `${env.NEXT_PUBLIC_BASE_URL}/api/callback/twitter`;

const app = new Elysia({ prefix: '/api' })
  .use(
    swagger({
      path: '/docs',
      exclude: /internal|callback|cron|docs/,
      documentation: {
        info: {
          version: '1.0.0',
          title: `${APP_NAME} API`,
          description: APP_DESCRIPTION
        }
      }
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
  .get('/internal-twitter-login', async ({ set }) => {
    if (!env.TWITTER_CONSUMER_KEY || !env.TWITTER_CONSUMER_SECRET) {
      set.status = 500;
      return { error: 'twitter_consumer_keys_missing' };
    }

    const twitter = new TwitterApi({
      appKey: env.TWITTER_CONSUMER_KEY,
      appSecret: env.TWITTER_CONSUMER_SECRET
    });

    const authLink = await twitter.generateAuthLink(TWITTER_CALLBACK_URL, {
      linkMode: 'authorize'
    });

    const options = {
      secure: env.NODE_ENV === 'production',
      maxAge: 60 * 10,
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    } as const;

    set.cookie = {
      internal_twitter_oauth_token: {
        ...options,
        value: authLink.oauth_token
      },
      internal_twitter_oauth_token_secret: {
        ...options,
        value: authLink.oauth_token_secret
      }
    };

    set.redirect = authLink.url;
  })
  .group('/callback', (app) =>
    app
      .get(
        '/twitter',
        async ({ query, cookie, set }) => {
          if (!env.TWITTER_CONSUMER_KEY || !env.TWITTER_CONSUMER_SECRET) {
            set.status = 500;
            return { error: 'twitter_consumer_keys_missing' };
          }

          const twitter = new TwitterApi({
            appKey: env.TWITTER_CONSUMER_KEY,
            appSecret: env.TWITTER_CONSUMER_SECRET,
            accessToken: cookie.internal_twitter_oauth_token.get(),
            accessSecret: cookie.internal_twitter_oauth_token_secret.get()
          });
          try {
            const { accessToken, accessSecret } = await twitter.login(
              query.oauth_verifier
            );
            return { accessToken, accessSecret };
          } catch (err) {
            set.status = 500;
            console.error('Twitter OAuth error:', err);
            return { error: 'internal_server_error' };
          }
        },
        {
          query: t.Object({
            oauth_token: t.String(),
            oauth_verifier: t.String()
          }),
          cookie: t.Object({
            internal_twitter_oauth_token: t.String(),
            internal_twitter_oauth_token_secret: t.String()
          })
        }
      )
      .get(
        '/github',
        async ({ query, cookie, set }) => {
          if (query.state !== cookie.oauth_state.get()) {
            set.status = 400;
            return { error: 'invalid_parameters' };
          }

          try {
            const tokens = await github.validateAuthorizationCode(query.code);
            const githubUserResponse = await fetch(
              'https://api.github.com/user',
              { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
            );
            const githubUser: GitHubUserResponse =
              await githubUserResponse.json();

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
                return { error: 'github_email_missing' };
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
            set.status = 500;
            console.error('GitHub OAuth2 error:', err);
            return { error: 'internal_server_error' };
          }
        },
        {
          query: t.Object({ code: t.String(), state: t.String() }),
          cookie: t.Object({ oauth_state: t.String() })
        }
      )
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

          revalidateTag(`definitions:${termToSlug(definition.term)}`);
          revalidateTag('home_feed');
          revalidatePath('/');

          // Post on X (Twitter)
          if (
            env.TWITTER_CONSUMER_KEY &&
            env.TWITTER_CONSUMER_SECRET &&
            env.TWITTER_ACCESS_TOKEN &&
            env.TWITTER_ACCESS_TOKEN_SECRET
          ) {
            const twitter = new TwitterApi({
              appKey: env.TWITTER_CONSUMER_KEY,
              appSecret: env.TWITTER_CONSUMER_SECRET,
              accessToken: env.TWITTER_ACCESS_TOKEN,
              accessSecret: env.TWITTER_ACCESS_TOKEN_SECRET
            });
            try {
              await twitter.v2.tweet(
                `Today's word of the day is ${definition.term}! 💡\n\n` +
                  `${definition.term}: ${definition.definition}\n\n` +
                  `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(definition.term)}\n\n` +
                  '#buildinpublic #indiehackers #developers'
              );
            } catch (err) {
              set.status = 500;
              console.error('Twitter error:', err);
              return { error: 'internal_server_error' };
            }
          }

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
