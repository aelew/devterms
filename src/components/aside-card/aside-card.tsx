'use client';

import { SiGithub } from '@icons-pack/react-simple-icons';
import { GeistMono } from 'geist/font/mono';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  ShuffleIcon
} from 'lucide-react';
import { usePlausible } from 'next-plausible';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CATEGORIES, cn } from '@/lib/utils';
import type { Events } from '@/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible';
import { showRandomDefinition } from './_actions';

export function AsideCard() {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const plausible = usePlausible<Events>();
  const pathname = usePathname();
  return (
    <aside className="h-fit space-y-[15px] md:w-1/3">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>DevTerms</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">
            A crowdsourced dictionary for developers by developers. Find
            definitions for all sorts of technical terms, programming jargon,
            and more!
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
            <Button
              onClick={() => plausible("I'm feeling lucky")}
              className="w-full"
              variant="outline"
            >
              <ShuffleIcon className="mr-2 size-3" />
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
      {pathname !== '/browse' && (
        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
          <Card>
            <CardHeader>
              <CollapsibleTrigger>
                <div className="flex items-center justify-between">
                  <CardTitle>Browse definitions</CardTitle>
                  <Button
                    className="size-5"
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    {collapsibleOpen ? (
                      <ChevronUpIcon className="size-4" />
                    ) : (
                      <ChevronDownIcon className="size-4" />
                    )}
                  </Button>
                </div>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent
                className={cn(
                  'grid grid-cols-4 gap-2 md:grid-cols-6',
                  GeistMono.className
                )}
              >
                {CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    href={`/browse/${category}`}
                    className={buttonVariants({
                      className: 'border border-input',
                      variant: 'secondary'
                    })}
                  >
                    {category}
                  </Link>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}
    </aside>
  );
}
