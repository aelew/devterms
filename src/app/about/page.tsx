import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
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
        </CardHeader>
      </Card>
    </div>
  );
}
