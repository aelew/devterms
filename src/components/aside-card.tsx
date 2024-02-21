import { SiGithub } from '@icons-pack/react-simple-icons';
import { sql } from 'drizzle-orm';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { db } from '@/server/db';

export function AsideCard() {
  async function showRandomDefinition() {
    'use server';
    const definition = await db.query.definitions.findFirst({
      columns: { term: true },
      orderBy: sql`rand()`
    });
    if (!definition) {
      throw new Error('No definitions available');
    }
    redirect(`/define/${definition.term}`);
  }
  return (
    <Card className="h-fit md:w-1/3">
      <CardHeader className="pb-4">
        <CardTitle>DevTerms</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground">
          A crowdsourced dictionary for developers by developers. Find
          definitions for all sorts of technical terms, programming jargon, and
          more!
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link
          href="/submit"
          className={buttonVariants({
            className: 'w-full',
            variant: 'outline'
          })}
        >
          <PlusIcon className="mr-2 size-4" />
          Submit a definition
        </Link>
        <form className="contents" action={showRandomDefinition}>
          <Button className="w-full" variant="outline">
            <span className="mr-2" aria-hidden>
              🍀
            </span>{' '}
            I&apos;m feeling lucky
          </Button>
        </form>
        <Link
          target="_blank"
          href="https://github.com/aelew/devterms"
          className={buttonVariants({
            className: 'w-full',
            variant: 'outline'
          })}
        >
          <SiGithub className="mr-2 size-4" />
          GitHub
        </Link>
      </CardFooter>
    </Card>
  );
}
