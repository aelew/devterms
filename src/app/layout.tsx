import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';
import { baseMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { Canonical } from './canonical';
import { Header } from './header';
import { MetaTags } from './metatags';

import './globals.css';

export const metadata = baseMetadata;

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
        <MetaTags />
        <Canonical />
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
