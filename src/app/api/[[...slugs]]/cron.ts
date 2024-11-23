import AtpAgent, { CredentialSession, RichText } from '@atproto/api';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import MeiliSearch from 'meilisearch';
import { revalidatePath, revalidateTag } from 'next/cache';
import { TwitterApi } from 'twitter-api-v2';

import { env } from '@/env';
import { getOpenGraphImageUrl, getRandomDefinition } from '@/lib/definitions';
import { termToSlug, truncateString } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions, wotds } from '@/server/db/schema';

const TERM_PLACEHOLDER = '%TERM_PLACEHOLDER%';
const X_CHARACTER_LIMIT = 280;
const BSKY_CHARACTER_LIMIT = 300;

export const cronRoutes = new Hono()
  .use(async (c, next) => {
    const authorizationHeader = c.req.header('Authorization');
    if (authorizationHeader !== `Bearer ${env.CRON_SECRET}`) {
      return c.json(
        {
          success: false,
          error: 'unauthorized'
        },
        401
      );
    }
    await next();
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
          error: 'no_definitions_available'
        },
        404
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

      const statusTemplate =
        `💡 Today's word of the day is ${definition.term}!\n\n` +
        `${definition.term}: ${TERM_PLACEHOLDER}\n\n` +
        `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(definition.term)}\n\n` +
        '#buildinpublic #developers';

      const truncatedDefinition = truncateString(
        definition.definition,
        X_CHARACTER_LIMIT - statusTemplate.length - TERM_PLACEHOLDER.length
      );

      const status = statusTemplate.replace(
        TERM_PLACEHOLDER,
        truncatedDefinition
      );

      try {
        await twitter.v2.tweet(status);
      } catch (err) {
        console.error('Twitter error:', err);

        return c.json(
          {
            success: false,
            error: 'internal_server_error'
          },
          500
        );
      }
    }

    // Post on Bluesky
    if (env.BLUESKY_USERNAME && env.BLUESKY_PASSWORD) {
      const messageTemplate =
        `💡 Today's word of the day is ${definition.term}!\n\n` +
        `${definition.term}: ${TERM_PLACEHOLDER}\n\n` +
        '#coding #developers #buildinpublic';

      const truncatedDefinition = truncateString(
        definition.definition,
        BSKY_CHARACTER_LIMIT - messageTemplate.length - TERM_PLACEHOLDER.length
      );

      const message = messageTemplate.replace(
        TERM_PLACEHOLDER,
        truncatedDefinition
      );

      const session = new CredentialSession(new URL('https://bsky.social'));
      const agent = new AtpAgent(session);

      const rt = new RichText({ text: message });
      await rt.detectFacets(agent);

      try {
        await agent.login({
          identifier: env.BLUESKY_USERNAME,
          password: env.BLUESKY_PASSWORD
        });

        const ogUrl = getOpenGraphImageUrl(termToSlug(definition.term));
        const ogResponse = await fetch(ogUrl);
        const ogBlob = await ogResponse.blob();

        const { data } = await agent.uploadBlob(ogBlob);

        await agent.post({
          text: rt.text,
          facets: rt.facets,
          embed: {
            $type: 'app.bsky.embed.external',
            external: {
              uri: `${env.NEXT_PUBLIC_BASE_URL}/define/${termToSlug(definition.term)}`,
              title: `What is ${definition.term}?`,
              description: definition.definition,
              thumb: data.blob
            }
          }
        });
      } catch (err) {
        console.error('Bluesky error:', err);

        return c.json(
          {
            success: false,
            error: 'internal_server_error'
          },
          500
        );
      }
    }

    return c.json({ success: true });
  });
