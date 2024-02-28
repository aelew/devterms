import { eq } from 'drizzle-orm';
import { Elysia, t } from 'elysia';
import MeiliSearch from 'meilisearch';
import { revalidatePath, revalidateTag } from 'next/cache';
import { TwitterApi } from 'twitter-api-v2';

import { env } from '@/env';
import { getRandomDefinition } from '@/lib/definitions';
import { termToSlug, truncateString } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions, wotds } from '@/server/db/schema';

export const cronRoutes = new Elysia({ prefix: '/cron' }).guard(
  { headers: t.Object({ authorization: t.String() }) },
  (app) =>
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

        await index.updateSortableAttributes(['term']);
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

          const placeholder = '%TERM_DEFINITION%';

          const statusTemplate =
            `Today's word of the day is ${definition.term}! 💡\n\n` +
            `${definition.term}: ${placeholder}\n\n` +
            `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(definition.term)}\n\n` +
            '#buildinpublic #developers';

          const CHARACTER_LIMIT = 280;

          const truncatedDefinition = truncateString(
            definition.definition,
            CHARACTER_LIMIT - statusTemplate.length - placeholder.length
          );

          const status = statusTemplate.replace(
            placeholder,
            truncatedDefinition
          );

          try {
            await twitter.v2.tweet(status);
          } catch (err) {
            set.status = 500;
            console.error('Twitter error:', err);
            return { error: 'internal_server_error' };
          }
        }

        return { success: true };
      })
);
