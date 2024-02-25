import { z } from 'zod';

export const reportFormSchema = z.object({
  definitionId: z.string(),
  reason: z.string().min(4, { message: 'Reason must be at least 4 characters.' })
});
