import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import type { PropsWithChildren } from 'react';
import { toast, Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Header } from './header';

import './globals.css';

import { env } from '@/env';

export const metadata: Metadata = {
  title: {
    default: 'DevTerms',
    template: '%s | DevTerms'
  },
  description:
    'A crowdsourced dictionary for developers by developers. Find definitions for all sorts of technical terms, programming jargon, and more!'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <PlausibleProvider
          customDomain="https://s.aelew.dev"
          domain="devterms.io"
          trackOutboundLinks
          taggedEvents
          selfHosted
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          GeistSans.className,
          'mb-8 flex min-h-screen flex-col antialiased'
        )}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <Header />
          <main className="container">{children}</main>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
