import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Definition } from '@/types';
import { DefinitionReportButton } from './report-button';
import { DefinitionShareButton } from './share-button';
import { VoteActions } from './vote-actions';

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
    <Card id={definition.id} className={cn('relative', className)}>
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
        <p>{definition.definition}</p>
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
