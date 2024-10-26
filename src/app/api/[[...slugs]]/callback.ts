import { zValidator } from '@hono/zod-validator';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import {
  createSession,
  generateSessionToken,
  github,
  setSessionCookie
} from '@/lib/auth';
import { generateId } from '@/lib/id';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import type { GitHubEmailListResponse, GitHubUserResponse } from '@/types';

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
          error: 'bad_request'
        },
        400
      );
    }

    try {
      const tokens = await github.validateAuthorizationCode(query.code);

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`
        }
      });

      const githubUser: GitHubUserResponse = await githubUserResponse.json();

      const existingUser = await db.query.users.findFirst({
        where: eq(users.githubId, githubUser.id)
      });

      if (existingUser) {
        const token = generateSessionToken();

        const session = await createSession(token, existingUser.id);
        await setSessionCookie(token, session.expiresAt);

        return c.redirect('/');
      }

      let userEmail: string | null = githubUser.email;

      // Special case for GitHub accounts with private emails
      if (!userEmail) {
        const githubEmailListResponse = await fetch(
          'https://api.github.com/user/emails',
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`
            }
          }
        );

        const githubEmails: GitHubEmailListResponse =
          await githubEmailListResponse.json();

        if (!Array.isArray(githubEmails) || githubEmails.length < 1) {
          return c.json(
            {
              success: false,
              error: 'invalid_github_email_list_response'
            },
            500
          );
        }

        userEmail =
          githubEmails.find((email) => email.primary)?.email ??
          githubEmails.find((email) => email.verified)?.email ??
          null;

        if (!userEmail) {
          return c.json(
            {
              success: false,
              error: 'missing_verified_github_email'
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

      const token = generateSessionToken();

      const session = await createSession(token, userId);
      await setSessionCookie(token, session.expiresAt);

      return c.redirect('/');
    } catch (err) {
      if (err instanceof OAuth2RequestError) {
        return c.json(
          {
            success: false,
            error: 'invalid_code'
          },
          400
        );
      }

      console.error('GitHub OAuth2 error:', err);

      return c.json(
        {
          success: false,
          error: 'internal_server_error'
        },
        500
      );
    }
  }
);
