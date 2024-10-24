import { env } from 'process';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import type { CookieOptions } from 'hono/utils/cookie';
import { TwitterApi } from 'twitter-api-v2';
import { z } from 'zod';

const twitterRoutes = new Hono()
  .use(async (c, next) => {
    if (!env.TWITTER_CONSUMER_KEY || !env.TWITTER_CONSUMER_SECRET) {
      return c.json(
        {
          success: false,
          error: 'Twitter consumer credentials missing'
        },
        500
      );
    }
    await next();
  })
  .get('/login', async (c) => {
    const twitter = new TwitterApi({
      appKey: env.TWITTER_CONSUMER_KEY!,
      appSecret: env.TWITTER_CONSUMER_SECRET!
    });

    const authLink = await twitter.generateAuthLink(
      `${env.NEXT_PUBLIC_BASE_URL}/api/development/twitter/collect`,
      { linkMode: 'authorize' }
    );

    const opts = {
      sameSite: 'lax',
      httpOnly: true,
      secure: false,
      maxAge: 600,
      path: '/'
    } satisfies CookieOptions;

    setCookie(c, 'dev__twitter_oauth_token', authLink.oauth_token, opts);
    setCookie(c, 'dev__twitter_oauth_token_secret', authLink.oauth_token, opts);

    return c.redirect(authLink.url);
  })
  .get(
    '/collect',
    zValidator(
      'query',
      z.object({
        oauth_token: z.string(),
        oauth_verifier: z.string()
      })
    ),
    zValidator(
      'cookie',
      z.object({
        dev__twitter_oauth_token: z.string(),
        dev__twitter_oauth_token_secret: z.string()
      })
    ),
    async (c) => {
      const query = c.req.valid('query');
      const cookie = c.req.valid('cookie');

      const twitter = new TwitterApi({
        appKey: env.TWITTER_CONSUMER_KEY!,
        appSecret: env.TWITTER_CONSUMER_SECRET!,
        accessToken: cookie.dev__twitter_oauth_token,
        accessSecret: cookie.dev__twitter_oauth_token_secret
      });
      try {
        const { accessToken, accessSecret } = await twitter.login(
          query.oauth_verifier
        );

        return c.json({ accessToken, accessSecret });
      } catch (err) {
        console.error('Twitter OAuth2 error:', err);

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

export const developmentRoutes = new Hono()
  .use(async (c, next) => {
    if (env.NODE_ENV !== 'development') {
      return c.json(
        {
          success: false,
          error: 'This endpoint is only available in development environments.'
        },
        403
      );
    }
    await next();
  })
  .route('/twitter', twitterRoutes);
