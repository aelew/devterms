import { cookies } from 'next/headers';
import { cache } from 'react';

import { getSessionId, lucia } from '.';

export const getAuthData = cache(async () => {
  const cookieStore = await cookies();

  const sessionId = getSessionId(cookieStore);
  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);

  // Next.js throws an error when you attempt to set a cookie when rendering a page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}

  return result;
});
