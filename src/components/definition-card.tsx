import {
  FlagIcon,
  ShareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Definition } from '@/types';

interface DefinitionCardProps {
  definition: Definition & { user: { name: string | null } };
  badges?: string[];
  className?: string;
}

export function DefinitionCard({
  definition,
  badges,
  className
}: DefinitionCardProps) {
  return (
    <Card className={cn('relative', className)}>
      {badges && (
        <div className="absolute right-6 top-6">
          <div className="flex gap-2">
            {badges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-3xl">{definition.term}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{definition.description}</p>
        <small className="italic text-muted-foreground">
          &ldquo;{definition.example}&rdquo;
        </small>
        <div className="mt-6 flex items-center text-sm">
          <p>
            <span className="font-semibold">
              <span aria-hidden>&mdash; </span>
              <Link
                className="hover:underline hover:underline-offset-4"
                href={`/u/${definition.user.name}`}
              >
                {definition.user.name}
              </Link>
            </span>
            <span aria-hidden> &middot; </span>
            <span>June 12, 2023</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-4 text-sm">
        <div>
          <Button
            className="rounded-full rounded-r-none border-r-0"
            variant="outline"
          >
            <ThumbsUpIcon className="mr-2 size-3.5" />
            {definition.upvotes}
          </Button>
          <Button className="rounded-full rounded-l-none" variant="outline">
            <ThumbsDownIcon className="mr-2 size-3.5" />
            {definition.downvotes}
          </Button>
        </div>
        <div className="flex gap-4 text-muted-foreground">
          <button className="flex items-center hover:text-muted-foreground/80">
            <ShareIcon className="mr-1.5 size-4" />
            Share
          </button>
          <button className="flex items-center hover:text-muted-foreground/80">
            <FlagIcon className="mr-1.5 size-4" />
            Report
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
