'use server';

import { protectedAction } from '@/lib/action';
import { formSchema } from './form';

export const submitDefinition = protectedAction(
  formSchema,
  async ({ term, definition, example }) => {
    return {};
  }
);
