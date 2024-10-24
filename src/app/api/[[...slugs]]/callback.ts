import { zValidator } from '@hono/zod-validator';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { github, lucia } from '@/lib/auth';
import { generateId } from '@/lib/id';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import type { GitHubEmailsResponse, GitHubUserResponse } from '@/types';

export const callbackRoutes = new Hono().get(
  '/github',
  zValidator('query', z.object({ code: z.string(), state: z.string() })),
  zValidator('cookie', z.object({ oauth_state: z.string() })),
  async (c) => {
    const query = c.req.valid('query');
    const cookie = c.req.valid('cookie');

    if (query.state !== cookie.oauth_state) {
      return c.json(
        {
          success: false,
          error: 'Invalid parameters.'
        },
        400
      );
    }

    try {
      const tokens = await github.validateAuthorizationCode(query.code);

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
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

        return c.redirect('/');
      }

      let userEmail: string | null = githubUser.email;

      // Special case for GitHub accounts with private emails
      if (!userEmail) {
        const githubEmailsResponse = await fetch(
          'https://api.github.com/user/emails',
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`
            }
          }
        );

        const githubEmails: GitHubEmailsResponse =
          await githubEmailsResponse.json();

        userEmail =
          githubEmails.find((email) => email.primary)?.email ??
          githubEmails.find((email) => email.verified)?.email ??
          null;

        if (!userEmail) {
          return c.json(
            {
              success: false,
              error: 'GitHub account email missing'
            },
            400
          );
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

      return c.redirect('/');
    } catch (err) {
      if (err instanceof OAuth2RequestError) {
        return c.json(
          {
            success: false,
            error: 'Invalid code'
          },
          400
        );
      }

      console.error('GitHub OAuth2 error:', err);

      return c.json(
        {
          success: false,
          error: 'Internal server error'
        },
        500
      );
    }
  }
);
