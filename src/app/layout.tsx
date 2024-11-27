import { GeistSans } from 'geist/font/sans';
import PlausibleProvider from 'next-plausible';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import type { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

import { Spotlight } from '@/components/spotlight';
import { baseMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { Canonical } from './_components/canonical';
import { Header } from './_components/header';

import './globals.css';

export const metadata = baseMetadata;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="DevTerms" />
        {/* prettier-ignore */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        {/* prettier-ignore */}
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=2" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="manifest" href="/site.webmanifest?v=2" />
        <Canonical />
        <PlausibleProvider
          customDomain="https://nom.aelew.dev"
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
