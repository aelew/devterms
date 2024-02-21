import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { GitHubButton } from './github-button';

export const metadata: Metadata = { title: 'Login' };

export default function SignInPage() {
  return (
    <Card className="mx-auto mt-24 max-w-sm">
      <CardHeader className="items-center">
        <Link className="my-2" href="/">
          <Image src="/icon.png" alt="Logo" width={36} height={36} />
        </Link>
        <CardTitle>Sign in to DevTerms</CardTitle>
        <CardDescription>The developer dictionary</CardDescription>
      </CardHeader>
      <CardContent>
        <GitHubButton />
      </CardContent>
    </Card>
  );
}
