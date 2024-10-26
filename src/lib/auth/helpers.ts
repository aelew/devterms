import { cookies } from 'next/headers';
import { cache } from 'react';

import { getSessionToken, validateSessionToken } from '.';

// This is in a separate file so we can wrap it with React's cache() without issues
export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();

  const token = getSessionToken(cookieStore);
  if (!token) {
    return { user: null, session: null };
  }

  const validationResult = await validateSessionToken(token);
  return validationResult;
});
