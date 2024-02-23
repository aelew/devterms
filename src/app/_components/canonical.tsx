'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { env } from '@/env';

export function Canonical() {
  const pathname = usePathname();
  const [url, setURL] = useState(env.NEXT_PUBLIC_BASE_URL + pathname);

  useEffect(() => {
    setURL(env.NEXT_PUBLIC_BASE_URL + pathname);
  }, [pathname]);

  return (
    <>
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
    </>
  );
}
