import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

import { APP_DESCRIPTION, APP_NAME } from '@/lib/seo';
import { callbackRoutes } from './callback';
import { cronRoutes } from './cron';
import { devRoutes } from './dev';
import { publicRoutes } from './public';

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
  .use(publicRoutes)
  .use(callbackRoutes)
  .use(cronRoutes)
  .use(devRoutes)
  .compile();

const handle = app.handle;

export { handle as GET, handle as POST };
