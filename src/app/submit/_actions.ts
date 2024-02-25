'use server';

import { protectedAction } from '@/lib/action';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';
import { formSchema } from './schema';

// TODO: Implement CF Turnstile captcha
export const submitDefinition = protectedAction(formSchema, async ({ term, definition, example }, { user }) => {
  await db.insert(definitions).values({ userId: user.id, term, definition, example });
  return { message: 'Your definition has been submitted for review!' };
});
