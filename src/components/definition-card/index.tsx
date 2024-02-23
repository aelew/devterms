import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn, termToSlug } from '@/lib/utils';
import type { Definition } from '@/types';
import { Time } from '../time';
import { DefinitionReportButton } from './report-button';
import { DefinitionShareButton } from './share-button';
import { VoteActions } from './vote-actions';

interface DefinitionCardProps {
  definition: Definition & { user?: { name: string | null } };
  badges?: string[];
  className?: string;
}

export function DefinitionCard({
  definition,
  badges,
  className
}: DefinitionCardProps) {
  return (
    <Card id={definition.id} className={cn('relative', className)}>
      {badges && (
        <div className="absolute right-6 top-8">
          <div className="flex gap-2">
            {badges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        </div>
      )}
      <CardHeader>
        <Link
          className="w-fit max-w-[79%] transition-color-transform active:scale-[0.98]"
          href={`/define/${termToSlug(definition.term)}`}
        >
          <CardTitle className="text-gradient w-fit text-3xl transition-opacity hover:opacity-70 dark:hover:opacity-95">
            {definition.term}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="leading-5">{definition.definition}</p>
          <p className="text-sm italic leading-4 text-muted-foreground">
            &quot;
            {definition.example}
            &quot;
          </p>
        </div>
        <div className="flex items-center text-sm">
          <p>
            <span aria-hidden>&mdash; </span>
            {definition.user?.name && (
              <>
                <span className="font-semibold">
                  <Link
                    className="hover:underline hover:underline-offset-4"
                    href={`/u/${definition.user.name}`}
                  >
                    {definition.user.name}
                  </Link>
                </span>
                <span aria-hidden> &middot; </span>
              </>
            )}
            <Time date={definition.createdAt} />
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-4 text-sm">
        <VoteActions
          definitionId={definition.id}
          upvotes={definition.upvotes}
          downvotes={definition.downvotes}
        />
        <div className="flex gap-4">
          <DefinitionShareButton term={definition.term} />
          <DefinitionReportButton definitionId={definition.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
