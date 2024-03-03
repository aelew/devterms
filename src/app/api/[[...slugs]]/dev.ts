import { Elysia } from 'elysia';
import { TwitterApi } from 'twitter-api-v2';

import { env } from '@/env';

const TWITTER_CALLBACK_URL = `${env.NEXT_PUBLIC_BASE_URL}/api/callback/twitter`;

export const devRoutes = new Elysia()
  .onBeforeHandle(({ set }) => {
    if (env.NODE_ENV !== 'development') {
      set.status = 403;
      throw new Error('Only available in development');
    }
  })
  .get('/internal-twitter-login', async ({ set }) => {
    if (!env.TWITTER_CONSUMER_KEY || !env.TWITTER_CONSUMER_SECRET) {
      set.status = 500;
      throw new Error('Twitter consumer keys missing');
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
  });
