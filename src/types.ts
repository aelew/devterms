import type { InferSelectModel } from 'drizzle-orm';

import type { definitions } from './server/db/schema';

export type Definition = InferSelectModel<typeof definitions>;
