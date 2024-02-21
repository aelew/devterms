import type { Metadata } from 'next';

import { SubmitDefinitionForm } from './form';

export const metadata: Metadata = { title: 'Submit a definition' };

export default function SubmitDefinitionPage() {
  return (
    <div className="mx-auto mt-8 flex max-w-md flex-col gap-2">
      <h1 className="text-center text-3xl font-semibold tracking-tight">
        Submit a definition
      </h1>
      <SubmitDefinitionForm />
    </div>
  );
}
