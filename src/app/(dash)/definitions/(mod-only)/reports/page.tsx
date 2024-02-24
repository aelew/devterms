import { eq } from 'drizzle-orm';

import { getPageMetadata } from '@/lib/seo';
import { db } from '@/server/db';
import { reports } from '@/server/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';

export const metadata = getPageMetadata({ title: 'Reported definitions' });

export default async function ReportedDefinitionsPage() {
  const data = await db.query.reports.findMany({
    where: eq(reports.read, false),
    columns: {
      id: true,
      reason: true,
      createdAt: true
    },
    with: {
      user: {
        columns: {
          name: true
        }
      },
      definition: {
        columns: {
          term: true,
          definition: true,
          example: true
        }
      }
    }
  });
  return <DataTable columns={columns} data={data} />;
}
