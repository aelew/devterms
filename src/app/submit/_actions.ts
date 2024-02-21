'use server';

import { z } from 'zod';

import { action } from '@/lib/action';
import { formSchema } from './form';

export const submitDefinition = action(
  formSchema,
  async ({ term, definition, example }) => {
    return {};
  }
);
