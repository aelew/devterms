import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import MeiliSearch from 'meilisearch';
import { revalidatePath, revalidateTag } from 'next/cache';
import { TwitterApi } from 'twitter-api-v2';

import { env } from '@/env';
import { getRandomDefinition } from '@/lib/definitions';
import { termToSlug, truncateString } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions, wotds } from '@/server/db/schema';

export const cronRoutes = new Hono()
  .use(async (c) => {
    const authorizationHeader = c.req.header('Authorization');
    if (authorizationHeader !== `Bearer ${env.CRON_SECRET}`) {
      return c.json(
        {
          success: false,
          error: 'Unauthorized'
        },
        401
      );
    }
  })
  .get('/meilisearch', async (c) => {
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

    await index.updateSortableAttributes(['term']);
    await index.updateDocuments(data, { primaryKey: 'id' });

    return c.json({ success: true });
  })
  .get('/wotd', async (c) => {
    const definition = await getRandomDefinition();
    if (!definition) {
      return c.json(
        {
          success: false,
          error: 'No definitions available'
        },
        500
      );
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

      const definitionPlaceholder = '%TERM_DEFINITION%';

      const statusTemplate =
        `Today's word of the day is ${definition.term}! 💡\n\n` +
        `${definition.term}: ${definitionPlaceholder}\n\n` +
        `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(definition.term)}\n\n` +
        '#buildinpublic #developers';

      const CHARACTER_LIMIT = 280;

      const truncatedDefinition = truncateString(
        definition.definition,
        CHARACTER_LIMIT - statusTemplate.length - definitionPlaceholder.length
      );

      const status = statusTemplate.replace(
        definitionPlaceholder,
        truncatedDefinition
      );

      try {
        await twitter.v2.tweet(status);
      } catch (err) {
        console.error('Twitter error:', err);

        return c.json(
          {
            success: false,
            error: 'Internal server error'
          },
          500
        );
      }
    }

    return c.json({ success: true });
  });
