import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

import { env } from '@/env';
import * as schema from './schema';

const connection = connect({ url: env.DATABASE_URL });

export const db = drizzle(connection, { schema });
