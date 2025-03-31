import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { getPageMetadata } from '@/lib/seo';
import { GitHubButton } from './github-button';

export const metadata = getPageMetadata({
  title: 'Login',
  description:
    'Sign in with your GitHub account to contribute to DevTerms, a crowdsourced dictionary for developers!'
});

export default function SignInPage() {
  return (
    <Card className="mx-auto mt-24 max-w-sm">
      <CardHeader className="items-center space-y-0">
        <Link className="my-2" href="/">
          <Image src="/logo.png" alt="Logo" width={48} height={48} />
        </Link>
        <CardTitle className="text-xl/6" asChild>
          <h1>Sign in to DevTerms</h1>
        </CardTitle>
        <CardDescription>The developer dictionary</CardDescription>
      </CardHeader>
      <CardContent>
        <GitHubButton />
      </CardContent>
    </Card>
  );
}
