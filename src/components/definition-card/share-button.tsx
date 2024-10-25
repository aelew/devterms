'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon, QrCodeIcon, ShareIcon } from 'lucide-react';
import { usePlausible } from 'next-plausible';
import { QRCodeSVG } from 'qrcode.react';
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
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { env } from '@/env';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import type { Events, ShareMedium } from '@/types';

interface DefinitionShareButtonProps {
  definitionId: string;
  term: string;
}

const socialMedia = [
  {
    medium: 'X',
    icon: XIcon,
    shareButton: TwitterShareButton
  },
  {
    medium: 'Reddit',
    icon: RedditIcon,
    shareButton: RedditShareButton
  },
  {
    medium: 'LinkedIn',
    icon: LinkedinIcon,
    shareButton: LinkedinShareButton
  },
  {
    medium: 'Facebook',
    icon: FacebookIcon,
    shareButton: FacebookShareButton
  },
  {
    medium: 'Email',
    icon: EmailIcon,
    shareButton: EmailShareButton
  }
] as const;

export function DefinitionShareButton({
  definitionId,
  term
}: DefinitionShareButtonProps) {
  const url = `${env.NEXT_PUBLIC_BASE_URL}/d/${definitionId.slice(4)}`;

  const { status, copy } = useCopyToClipboard();
  const plausible = usePlausible<Events>();

  const CopyShareIcon = match(status)
    // @ts-ignore
    .with('error', () => motion.create(XIcon))
    .with('copied', () => motion.create(CheckIcon))
    .otherwise(() => motion.create(CopyIcon));

  const copyIconColor = match(status)
    .with('copied', () => 'text-green-500')
    .with('error', () => 'text-red-500')
    .otherwise(() => 'text-muted-foreground');

  const log = (medium: ShareMedium) => {
    plausible('Share', {
      props: {
        Medium: medium
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger className="flex items-center text-muted-foreground transition-color-transform hover:text-muted-foreground/80 active:scale-95">
        <ShareIcon className="mr-1.5 size-4" />
        Share
      </PopoverTrigger>
      <PopoverContent className="flex w-full gap-2 p-2 transition-opacity">
        {socialMedia.map(
          ({ medium, icon: ShareIcon, shareButton: ShareButton }) => (
            <ShareButton onClick={() => log(medium)} key={medium} url={url}>
              <ShareIcon size={24} round />
            </ShareButton>
          )
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="size-6 rounded-full shadow-none"
              onClick={() => log('QR Code')}
              variant="secondary"
              size="icon"
            >
              <QrCodeIcon size={12} />
            </Button>
          </DialogTrigger>
          <DialogContent
            aria-describedby={undefined}
            className="max-w-fit p-10"
          >
            <VisuallyHidden asChild>
              <DialogTitle />
            </VisuallyHidden>
            <QRCodeSVG
              className="rounded-lg border bg-white p-4 shadow"
              value={url}
              size={256}
            />
          </DialogContent>
        </Dialog>
        <Button
          className="size-6 rounded-full shadow-none"
          variant="outline"
          size="icon"
          onClick={() => {
            copy(url);
            log('Direct');
          }}
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
