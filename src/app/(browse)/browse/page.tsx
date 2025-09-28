import { GeistMono } from 'geist/font/mono';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPageMetadata } from '@/lib/seo';
import { CATEGORIES, cn } from '@/lib/utils';

export const metadata = getPageMetadata({ title: 'Browse definitions' });

export default function BrowsePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient text-3xl" asChild>
          <h1>Browse definitions</h1>
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          'grid grid-cols-4 gap-2 sm:grid-cols-6',
          GeistMono.className
        )}
      >
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            prefetch={false}
            href={`/browse/${category}`}
            className={buttonVariants({
              className: 'border border-input',
              variant: 'secondary'
            })}
          >
            {category}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
