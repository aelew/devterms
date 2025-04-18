'use client';

import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { slugToTerm, termToSlug } from '@/lib/utils';

export default function NotFound() {
  const params = useParams();
  const term = slugToTerm(params.term as string);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gradient text-3xl">{term}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p>
          There are no definitions for <strong>{term}</strong> yet.
        </p>
        <p>
          Know what it means?{' '}
          <Link
            href={`/submit?term=${termToSlug(term)}`}
            className="underline underline-offset-4"
          >
            Submit a definition here!
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
