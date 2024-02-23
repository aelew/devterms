import { GeistSans } from 'geist/font/sans';
import type { Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import NextTopLoader from 'nextjs-toploader';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

import { Spotlight } from '@/components/spotlight';
import { ThemeProvider } from '@/components/theme-provider';
import { baseMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { Canonical } from './_components/canonical';
import { Header } from './_components/header';
import { MetaTags } from './_components/metatags';

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
          'relative mb-8 flex min-h-screen flex-col antialiased'
        )}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {/* Grid background */}
          <div className="absolute -z-10 size-full bg-grid-black/[0.08] dark:bg-black dark:bg-grid-white/[0.15]">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
          </div>
          <NextTopLoader showSpinner={false} />
          <Header />
          <main className="container">{children}</main>
          <Toaster richColors />
          <Spotlight
            ellipseClassName="fill-sky-200/50 dark:fill-white/15"
            className="-top-40 left-0 md:-top-20 md:left-60"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
