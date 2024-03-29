import { eq } from 'drizzle-orm';

import { getPageMetadata } from '@/lib/seo';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';

export const metadata = getPageMetadata({ title: 'Pending definitions' });

export default async function PendingDefinitionsPage() {
  const data = await db.query.definitions.findMany({
    where: eq(definitions.status, 'pending'),
    columns: {
      id: true,
      term: true,
      definition: true,
      example: true,
      createdAt: true
    }
  });
  return <DataTable columns={columns} data={data} />;
}
