import { sha256 } from '@oslojs/crypto/sha2';
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase
} from '@oslojs/encoding';
import { GitHub } from 'arctic';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { env } from '@/env';
import { db } from '@/server/db';
import { sessions, users, type Session, type User } from '@/server/db/schema';

export type SessionValidationResult =
  | { user: User; session: Session }
  | { user: null; session: null };

export const SESSION_TTL = 1000 * 60 * 60 * 24 * 30; // ms
export const SESSION_COOKIE_NAME = 'auth_session';

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  null
);

export const getSessionToken = (cookies: {
  get(name: string): { value: string } | undefined;
}) => cookies?.get(SESSION_COOKIE_NAME)?.value ?? null;

export function generateSessionToken() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session: Session = {
    userId,
    id: sessionId,
    expiresAt: Date.now() + SESSION_TTL
  };

  await db.insert(sessions).values(session);

  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));

  if (result.length < 1) {
    return { user: null, session: null };
  }

  const { user, session } = result[0]!;

  if (Date.now() >= session.expiresAt) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return { user: null, session: null };
  }

  // Extend expiration when the session is at least halfway through its TTL
  if (Date.now() >= session.expiresAt - SESSION_TTL / 2) {
    session.expiresAt = Date.now() + SESSION_TTL;
    await db
      .update(sessions)
      .set({ expiresAt: session.expiresAt })
      .where(eq(sessions.id, session.id));
  }

  return { user, session };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function setSessionCookie(token: string, expiresAt: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    secure: env.NODE_ENV === 'production',
    expires: expiresAt,
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  });
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });
}

export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();

  const token = getSessionToken(cookieStore);
  if (!token) {
    return { user: null, session: null };
  }

  const validationResult = await validateSessionToken(token);
  return validationResult;
});
