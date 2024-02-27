import { GeistSans } from 'geist/font/sans';
import PlausibleProvider from 'next-plausible';
import NextTopLoader from 'nextjs-toploader';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

import { Canny } from '@/components/canny';
import { Spotlight } from '@/components/spotlight';
import { ThemeProvider } from '@/components/theme-provider';
import { getAuthData } from '@/lib/auth/helpers';
import { baseMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { Canonical } from './_components/canonical';
import { Header } from './_components/header';
import { MetaTags } from './_components/metatags';

import './globals.css';

export const metadata = baseMetadata;

export default async function RootLayout({ children }: PropsWithChildren) {
  const { user } = await getAuthData();
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <MetaTags />
        <Canonical />
        <Canny user={user} />
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
          'relative flex min-h-screen flex-col pb-8 antialiased'
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
