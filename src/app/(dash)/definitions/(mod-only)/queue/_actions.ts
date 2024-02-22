'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { moderatorAction } from '@/lib/action';
import { db } from '@/server/db';
import { definitions } from '@/server/db/schema';

export const updatePendingDefinition = moderatorAction(
  z.object({
    definitionId: z.string(),
    action: z.enum(['approve', 'reject', 'delete'])
  }),
  async ({ definitionId, action }) => {
    if (action === 'delete') {
      await db.delete(definitions).where(eq(definitions.id, definitionId));
    } else {
      await db
        .update(definitions)
        .set({ status: action === 'approve' ? 'approved' : 'rejected' })
        .where(eq(definitions.id, definitionId));
    }
  }
);
