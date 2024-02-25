import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPageMetadata } from '@/lib/seo';
import { GitHubButton } from './github-button';

export const metadata = getPageMetadata({
  title: 'Login',
  description: 'Sign in with your GitHub account to contribute to DevTerms, a crowdsourced dictionary for developers!'
});

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
