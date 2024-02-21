import type { Metadata } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card';
import { getAuthData } from '@/lib/auth/helpers';
import { SubmitDefinitionForm } from './form';

export const metadata: Metadata = { title: 'Submit a definition' };

export default async function SubmitDefinitionPage() {
  const { user } = await getAuthData();
  return (
    <div className="mx-auto mt-2 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Submit a definition
          </h1>
          <CardDescription className="text-balance text-xs">
            Your definition should be fit for a wide audience. Include
            background information if necessary. Refrain from mentioning inside
            jokes or individuals who are not public figures. Your definition
            will be reviewed before being published.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubmitDefinitionForm isAuthenticated={!!user} />
        </CardContent>
      </Card>
    </div>
  );
}
