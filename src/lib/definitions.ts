import { createHmac } from 'crypto';
import MeiliSearch from 'meilisearch';

import { env } from '@/env';
import type { DefinitionHit } from '@/types';

export function getOpenGraphImageUrl(slug: string) {
  const hmac = createHmac('sha256', env.OG_HMAC_SECRET);
  hmac.update(JSON.stringify({ slug: slug }));
  return `${env.NEXT_PUBLIC_BASE_URL}/api/og/${slug}?t=${hmac.digest('hex')}`;
}

export async function getRandomDefinition() {
  const meili = new MeiliSearch({
    host: env.NEXT_PUBLIC_MEILISEARCH_HOST,
    apiKey: env.MEILISEARCH_MASTER_KEY
  });

  const index = meili.index<DefinitionHit>('definitions');

  const { numberOfDocuments } = await index.getStats();

  // The maximum offset seems to be 1000 for now
  const maxOffset = Math.min(numberOfDocuments, 1000);
  const randomDocumentIdx = Math.floor(Math.random() * maxOffset);

  const searchResponse = await index.search(null, {
    offset: randomDocumentIdx,
    limit: 1
  });

  return searchResponse.hits[0];
}
