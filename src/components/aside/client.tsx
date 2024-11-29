'use client';

import { SiBluesky, SiGithub, SiX } from '@icons-pack/react-simple-icons';
import { GeistMono } from 'geist/font/mono';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
  PlusIcon,
  ShuffleIcon
} from 'lucide-react';
import { usePlausible } from 'next-plausible';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type PropsWithChildren } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { APP_DESCRIPTION, APP_NAME } from '@/lib/seo';
import { CATEGORIES, cn } from '@/lib/utils';
import type { Events } from '@/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible';
import { showRandomDefinition } from './_actions';

export function ClientAside({ children }: PropsWithChildren) {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const plausible = usePlausible<Events>();
  const pathname = usePathname();
  return (
    <aside className="h-fit space-y-[15px] md:w-1/3">
      <Card>
        <CardHeader className="space-y-4 pb-4">
          <CardTitle>{APP_NAME}</CardTitle>
          <p className="text-sm text-muted-foreground">{APP_DESCRIPTION}</p>
        </CardHeader>
        <CardContent className="pb-4">{children}</CardContent>
        <CardFooter className="flex flex-col gap-2">
          <form action={showRandomDefinition} className="contents">
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
            href="/submit"
            className={buttonVariants({
              className: 'w-full',
              variant: 'outline'
            })}
          >
            <PlusIcon className="mr-1 size-4" />
            Submit a definition
          </Link>
          <div className="flex w-full gap-2">
            <Link
              target="_blank"
              href="https://github.com/aelew/devterms"
              className={buttonVariants({
                className: 'w-full',
                variant: 'outline'
              })}
            >
              <SiGithub className="mr-2 size-4" />
              Star on GitHub
            </Link>
            <Link
              target="_blank"
              href="https://twitter.com/devtermsio"
              className={buttonVariants({
                size: 'icon',
                variant: 'outline',
                className: 'shrink-0'
              })}
            >
              <SiX className="size-4" />
            </Link>
            <Link
              target="_blank"
              href="https://bsky.app/profile/devterms.io"
              className={buttonVariants({
                size: 'icon',
                variant: 'outline',
                className: 'shrink-0'
              })}
            >
              <SiBluesky className="size-4" />
            </Link>
          </div>
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
                    prefetch={false}
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
      <div className="hidden items-center gap-1 text-center text-muted-foreground md:flex md:flex-col">
        <div className="flex gap-4 text-sm">
          <Link
            className="hover:underline hover:underline-offset-4"
            href="/about"
          >
            About
          </Link>
          <Link
            className="hover:underline hover:underline-offset-4"
            href="https://twitter.com/devtermsio"
            target="_blank"
          >
            X
          </Link>
          <Link
            className="hover:underline hover:underline-offset-4"
            href="https://bsky.app/profile/devterms.io"
            target="_blank"
          >
            Bluesky
          </Link>
          <Link
            className="hover:underline hover:underline-offset-4"
            href="https://github.com/aelew/devterms"
            target="_blank"
          >
            GitHub
          </Link>
        </div>
        <p className="flex items-center gap-1 text-xs">
          Made with <HeartIcon className="size-3.5 fill-muted-foreground/40" />{' '}
          by{' '}
          <Link
            className="underline decoration-muted-foreground/50 decoration-wavy underline-offset-2 transition-colors hover:text-muted-foreground/80 hover:decoration-muted-foreground/40"
            href="https://aelew.com"
            target="_blank"
          >
            Andre Lew
          </Link>
        </p>
        <div className="flex gap-2 text-xs">
          <Link
            className="hover:underline hover:underline-offset-4"
            href="https://iconkit.ai"
            target="_blank"
          >
            IconKit
          </Link>
          <span>|</span>
          <Link
            className="hover:underline hover:underline-offset-4"
            href="https://lookup.tools"
            target="_blank"
          >
            Lookup Tools
          </Link>
        </div>
      </div>
    </aside>
  );
}
