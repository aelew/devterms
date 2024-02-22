import { eq } from 'drizzle-orm';
import { MeiliSearch } from 'meilisearch';
import { NextResponse, type NextRequest } from 'next/server';

import { env } from '@/env';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

const meili = new MeiliSearch({
  host: env.NEXT_PUBLIC_MEILISEARCH_HOST,
  apiKey: env.MEILISEARCH_MASTER_KEY
});

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (authorization !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

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
  index.updateSortableAttributes(['term']);
  await index.updateDocuments(data, { primaryKey: 'id' });

  return NextResponse.json({ success: true });
}
