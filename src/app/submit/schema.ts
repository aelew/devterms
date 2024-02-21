import { z } from 'zod';

export const formSchema = z.object({
  term: z.string().min(1).max(64),
  definition: z.string().min(1).max(512),
  example: z.string().min(1).max(512)
});
