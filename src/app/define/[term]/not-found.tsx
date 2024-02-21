'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  const params = useParams();
  const term = decodeURIComponent(params.term as string);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{term}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p>
          There are no definitions for{' '}
          <strong className="font-semibold">{term}</strong> yet.
        </p>
        <p>
          Know what it means?{' '}
          <Link
            className="underline underline-offset-4"
            href={`/submit?term=${params.term}`}
          >
            Submit a definition here!
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
