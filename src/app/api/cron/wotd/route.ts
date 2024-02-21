import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import { env } from '@/env';
import { getRandomDefinition } from '@/lib/definitions';
import { db } from '@/server/db';
import { wotds } from '@/server/db/schema';

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  if (authorization !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const definition = await getRandomDefinition();
  if (!definition) {
    return NextResponse.json(
      { error: 'no_definitions_available' },
      { status: 500 }
    );
  }

  await db.insert(wotds).values({ definitionId: definition.id });
  revalidateTag('wotd');

  return NextResponse.json({ success: true }, { status: 200 });
}
