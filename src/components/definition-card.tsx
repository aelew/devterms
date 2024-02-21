'use client';

import {
  CopyIcon,
  FlagIcon,
  ShareIcon,
  ThumbsDownIcon,
  ThumbsUpIcon
} from 'lucide-react';
import Link from 'next/link';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterShareButton,
  XIcon
} from 'react-share';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
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
  const { status, copy } = useCopyToClipboard();
  const url = `https://devterms.io/define/${definition.term}#${definition.id}`;
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
          <Popover>
            <PopoverTrigger className="flex items-center hover:text-muted-foreground/80">
              <ShareIcon className="mr-1.5 size-4" />
              Share
            </PopoverTrigger>
            <PopoverContent className="flex w-full gap-2 p-2">
              <TwitterShareButton url={url}>
                <XIcon size={24} round />
              </TwitterShareButton>
              <RedditShareButton url={url}>
                <RedditIcon size={24} round />
              </RedditShareButton>
              <LinkedinShareButton url={url}>
                <LinkedinIcon size={24} round />
              </LinkedinShareButton>
              <FacebookShareButton url={url}>
                <FacebookIcon size={24} round />
              </FacebookShareButton>
              <EmailShareButton url={url}>
                <EmailIcon size={24} round />
              </EmailShareButton>
              <Button
                onClick={() => copy(url)}
                className="size-6 rounded-full shadow-none"
                variant="secondary"
                size="icon"
              >
                <CopyIcon size={12} />
              </Button>
            </PopoverContent>
          </Popover>
          <Dialog>
            <DialogTrigger className="flex items-center text-destructive hover:text-destructive/80">
              <FlagIcon className="mr-1.5 size-4" />
              Report
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report definition</DialogTitle>
              </DialogHeader>
              form
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
