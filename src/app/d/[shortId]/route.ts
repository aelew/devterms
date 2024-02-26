import { and, eq } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';

import { termToSlug } from '@/lib/utils';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

interface Params {
  shortId: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const definition = await db.query.definitions.findFirst({
    columns: { id: true, term: true },
    where: and(
      eq(definitions.id, `def_${params.shortId}`),
      eq(definitions.status, 'approved')
    )
  });
  if (!definition) {
    return NextResponse.json(
      { error: 'Definition not found' },
      { status: 404 }
    );
  }
  return NextResponse.redirect(
    new URL(`/define/${termToSlug(definition.term)}#${definition.id}`, req.url),
    { status: 308 }
  );
}
