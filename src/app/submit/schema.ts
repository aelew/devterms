import { z } from 'zod';

export const formSchema = z.object({
  term: z.string().trim().min(1).max(64),
  definition: z.string().trim().min(1).max(512),
  example: z.string().trim().min(1).max(512)
});
