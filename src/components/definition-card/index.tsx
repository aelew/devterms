import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { termToSlug } from '@/lib/utils';
import type { Definition } from '@/types';
import { Time } from '../time';
import { DefinitionReportButton } from './report-button';
import { DefinitionShareButton } from './share-button';
import { VoteActions } from './vote-actions';

interface DefinitionCardProps {
  definition: Definition & { user?: { name: string | null } };
  className?: string;
  badges?: string[];
}

export function DefinitionCard({
  definition,
  className,
  badges
}: DefinitionCardProps) {
  return (
    <Card id={definition.id} className={className}>
      <CardHeader>
        {badges && badges.length > 0 && (
          <div className="mb-2 flex gap-2">
            {badges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        )}
        <div>
          <Link
            className="contents transition-color-transform active:scale-[0.98]"
            href={`/define/${termToSlug(definition.term)}#${definition.id}`}
          >
            <CardTitle
              className="text-gradient text-3xl transition-opacity hover:opacity-70 dark:hover:opacity-85"
              asChild
            >
              <h2>{definition.term}</h2>
            </CardTitle>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="leading-5">{definition.definition}</p>
          <p className="text-sm leading-4 text-muted-foreground">
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
                    @{definition.user.name}
                  </Link>
                </span>
                <span aria-hidden> &middot; </span>
              </>
            )}
            <Time timestamp={definition.createdAt} />
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
          <DefinitionShareButton
            definitionId={definition.id}
            term={definition.term}
          />
          <DefinitionReportButton definitionId={definition.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
