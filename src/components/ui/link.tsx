'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

export const Link: typeof NextLink = ((props) => {
  const router = useRouter();

  return (
    <NextLink
      prefetch
      onMouseDown={(e) => {
        const url = new URL(String(props.href), window.location.href);
        if (
          url.origin === window.location.origin &&
          props.target !== '_blank' &&
          e.button === 0 &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          router.push(String(props.href));
        }
      }}
      {...props}
    />
  );
}) as typeof NextLink;
