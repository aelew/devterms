import { SiGithub } from '@icons-pack/react-simple-icons';
import { desc, eq, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { DefinitionCard } from '@/components/definition-card';
import { Time } from '@/components/time';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription } from '@/components/ui/card';
import { db } from '@/server/db';
import { definitions, users } from '@/server/db/schema';

interface UserResultCardsProps {
  name: string;
}

export const getUser = cache(
  unstable_cache(
    (name: string) =>
      db.query.users.findFirst({
        where: eq(users.name, sql`${name} COLLATE NOCASE`),
        columns: {
          name: true,
          role: true,
          avatar: true,
          createdAt: true
        },
        with: {
          definitions: {
            where: eq(definitions.status, 'approved'),
            orderBy: desc(definitions.createdAt),
            limit: 5
          }
        }
      }),
    ['user_definitions'],
    { revalidate: 1800 }
  )
);

export async function UserResultCards({ name }: UserResultCardsProps) {
  const user = await getUser(name);
  if (!user) {
    notFound();
  }
  return (
    <>
      <Card>
        <div className="flex gap-6 p-6">
          <Image
            alt={`Avatar of ${user.name}`}
            src={user.avatar + '&s=96'}
            className="rounded-xl"
            height={96}
            width={96}
            unoptimized
          />
          <div className="space-y-1">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-gradient text-3xl font-semibold tracking-tight">
                  {user.name}
                </h1>
                <Badge className="-mb-1">{user.role}</Badge>
              </div>
              <CardDescription>
                User since{' '}
                <strong>
                  <Time timestamp={user.createdAt} />
                </strong>
              </CardDescription>
            </div>
            <Link
              className="flex items-center text-sm font-medium text-muted-foreground hover:underline hover:underline-offset-4"
              href={`https://github.com/${user.name}`}
              target="_blank"
            >
              <SiGithub className="mr-2 size-4" />
              View on GitHub
            </Link>
          </div>
        </div>
      </Card>
      {user.definitions.map((definition) => (
        <DefinitionCard
          key={definition.id}
          definition={{
            ...definition,
            user: { name: user.name }
          }}
        />
      ))}
    </>
  );
}
