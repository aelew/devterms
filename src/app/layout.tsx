import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Header } from './header';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'DevTerms',
    template: '%s | DevTerms'
  },
  description:
    'A crowdsourced dictionary for developers by developers. Find definitions for all sorts of technical terms, programming jargon, and more!'
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.className,
          'mb-12 flex min-h-screen flex-col antialiased'
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
        </ThemeProvider>
      </body>
    </html>
  );
}
