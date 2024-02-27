'use client';

import { BellIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { env } from '@/env';

export function ChangelogButton() {
  const { theme } = useTheme();

  useEffect(() => {
    window.Canny('initChangelog', {
      theme: theme === 'system' ? 'auto' : theme ?? 'light',
      appID: env.NEXT_PUBLIC_CANNY_APP_ID,
      omitNonEssentialCookies: true,
      position: 'bottom',
      align: 'right'
    });
    return () => {
      window.Canny('closeChangelog');
    };
  }, [theme]);

  return (
    <Button
      aria-label="View changelog"
      data-canny-changelog
      variant="outline"
      size="icon"
    >
      <BellIcon className="size-4" />
    </Button>
  );
}
