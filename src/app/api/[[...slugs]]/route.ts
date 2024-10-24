import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { handle } from 'hono/vercel';

import { APP_DESCRIPTION, APP_NAME } from '@/lib/seo';
import { callbackRoutes } from './callback';
import { developmentRoutes } from './dev';
import { publicRoutes } from './public';

const app = new OpenAPIHono().basePath('/api');
const runtime = 'edge';

app.notFound((c) => c.json({ success: false, error: 'not_found' }, 404));

app.route('/callback', callbackRoutes);
app.route('/development', developmentRoutes);

app
  .route('/v1', publicRoutes)
  .doc('/v1/openapi.json', {
    openapi: '3.1.0',
    info: {
      version: '1.1.0',
      title: `${APP_NAME} API`,
      description: APP_DESCRIPTION
    }
  })
  .get(
    '/docs',
    apiReference({
      theme: 'deepSpace',
      favicon: '/icon.png',
      spec: { url: '/api/v1/openapi.json' },
      customCss: '.download-button { opacity: 0.75; }'
    })
  );

const handler = handle(app);

export { app, runtime, handler as GET, handler as POST };
