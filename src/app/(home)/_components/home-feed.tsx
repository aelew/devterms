import { desc, eq } from 'drizzle-orm';
import type { MySqlSelect } from 'drizzle-orm/mysql-core';
import { unstable_cache } from 'next/cache';

import { DefinitionCard } from '@/components/definition-card';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { db } from '@/server/db';
import { definitions, users, wotds } from '@/server/db/schema';

interface HomeFeedProps {
  page: number;
}

const PAGE_SIZE = 5;

function withPagination<T extends MySqlSelect>(qb: T, pageIndex: number) {
  return qb.limit(PAGE_SIZE).offset(pageIndex * PAGE_SIZE);
}

const getTotalPages = unstable_cache(
  async () => {
    const totalRecords = await db.select().from(wotds).count();
    return Math.ceil(totalRecords / PAGE_SIZE);
  },
  ['total_pages'],
  { tags: ['total_pages'], revalidate: 1800 }
);

const getHomeFeed = unstable_cache(
  (page: number) => {
    const query = db
      .select({
        definition: definitions,
        user: { name: users.name }
      })
      .from(wotds)
      .orderBy(desc(wotds.createdAt))
      .leftJoin(definitions, eq(definitions.id, wotds.definitionId))
      .leftJoin(users, eq(users.id, definitions.userId));
    const dynamicQuery = query.$dynamic();
    return withPagination(dynamicQuery, page - 1);
  },
  ['home_feed'],
  { tags: ['home_feed'], revalidate: 1800 }
);

export async function HomeFeed({ page }: HomeFeedProps) {
  const homeFeed = await getHomeFeed(page);
  const totalPages = await getTotalPages();
  return (
    <>
      {homeFeed.length ? (
        homeFeed.map((wotd, i) => {
          if (!wotd.definition) {
            return null;
          }
          const definition = {
            ...wotd.definition,
            user: { name: wotd.user?.name ?? null }
          };

          if (i === 0 && page === 1) {
            return (
              <DefinitionCard
                className="border-muted-foreground shadow-lg"
                badges={['Word of the day']}
                key={wotd.definition.id}
                definition={definition}
              />
            );
          }
          return (
            <DefinitionCard key={wotd.definition.id} definition={definition} />
          );
        })
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-medium">
              There&apos;s nothing here yet. Check back later!
            </CardTitle>
          </CardHeader>
        </Card>
      )}
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`/?page=${page - 1}`} />
            </PaginationItem>
          )}
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink href={`/?page=${i + 1}`}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={`/?page=${(page || 1) + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}