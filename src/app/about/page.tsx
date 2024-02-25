import Link from 'next/link';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { getPageMetadata } from '@/lib/seo';

export const metadata = getPageMetadata({ title: 'About' });

export default function AboutPage() {
  return (
    <div className="mt-2">
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-gradient text-3xl font-semibold tracking-tight">
            About
          </h1>
          <CardDescription className="mx-auto max-w-md">
            DevTerms is an community-driven dictionary of programming terms. The
            source code can be found on{' '}
            <Link
              className="font-medium hover:underline hover:underline-offset-4"
              href="https://github.com/aelew/devterms"
              target="_blank"
            >
              GitHub
            </Link>
            .
          </CardDescription>
          <CardDescription className="mx-auto max-w-lg">
            The DevTerms logo is adapted from the{' '}
            <Link
              className="font-medium hover:underline hover:underline-offset-4"
              href="https://github.com/twitter/twemoji"
              target="_blank"
            >
              Twemoji
            </Link>{' '}
            icons <span className="font-mono">hammer-and-wrench</span> and{' '}
            <span className="font-mono">blue-book</span> under the Attribution
            4.0 International (CC-BY 4.0) license.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
