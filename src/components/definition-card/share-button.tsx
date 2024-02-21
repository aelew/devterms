'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon, ShareIcon } from 'lucide-react';
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
import { match } from 'ts-pattern';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface DefinitionShareButtonProps {
  term: string;
}

export function DefinitionShareButton({ term }: DefinitionShareButtonProps) {
  const url = `https://devterms.io/define/${term}`;
  const { status, copy } = useCopyToClipboard();

  const CopyShareIcon = match(status)
    .with('copied', () => motion(CheckIcon))
    .with('error', () => motion(XIcon))
    .otherwise(() => motion(CopyIcon));

  const copyIconColor = match(status)
    .with('copied', () => 'text-green-500')
    .with('error', () => 'text-red-500')
    .otherwise(() => 'text-muted-foreground');

  return (
    <Popover>
      <PopoverTrigger className="flex items-center text-muted-foreground hover:text-muted-foreground/80">
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
          className="size-6 rounded-full shadow-none"
          onClick={() => copy(url)}
          variant="secondary"
          size="icon"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <CopyShareIcon
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className={copyIconColor}
              size={12}
            />
          </AnimatePresence>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
