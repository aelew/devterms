import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { getAuthData } from '@/lib/auth/helpers';
import { getPageMetadata } from '@/lib/seo';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';

export const metadata = getPageMetadata({ title: 'My definitions' });

export default async function MyDefinitionsPage() {
  const { user } = await getAuthData();
  if (!user) {
    notFound();
  }
  const data = await db.query.definitions.findMany({
    where: eq(definitions.userId, user.id),
    columns: {
      id: true,
      status: true,
      term: true,
      upvotes: true,
      downvotes: true,
      createdAt: true
    }
  });
  return <DataTable columns={columns} data={data} />;
}
