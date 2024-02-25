'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { moderatorAction } from '@/lib/action';
import { db } from '@/server/db';
import { definitions, reports } from '@/server/db/schema';

export const acknowledgeReport = moderatorAction(z.object({ reportId: z.string() }), async ({ reportId }) => {
  await db.update(reports).set({ read: true }).where(eq(reports.id, reportId));
});
