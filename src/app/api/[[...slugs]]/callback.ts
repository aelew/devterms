import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import { cookies } from 'next/headers';
import { TwitterApi } from 'twitter-api-v2';

import { env } from '@/env';
import { github, lucia } from '@/lib/auth';
import { generateId } from '@/lib/id';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import type { GitHubEmailsResponse, GitHubUserResponse } from '@/types';

export const callbackRoutes = new Elysia({ prefix: '/callback' })
  .get(
    '/twitter',
    async ({ query, cookie, set }) => {
      if (!env.TWITTER_CONSUMER_KEY || !env.TWITTER_CONSUMER_SECRET) {
        set.status = 500;
        throw new Error('Twitter consumer keys missing');
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
        throw new Error('Internal server error');
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
        throw new Error('Invalid parameters');
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
            throw new Error('GitHub email missing');
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
          throw new Error('Invalid code');
        }

        set.status = 500;
        console.error('GitHub OAuth2 error:', err);
        return new Error('Internal server error');
      }
    },
    {
      query: t.Object({ code: t.String(), state: t.String() }),
      cookie: t.Object({ oauth_state: t.String() })
    }
  );
