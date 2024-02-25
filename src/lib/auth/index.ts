import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { GitHub } from 'arctic';
import { Lucia } from 'lucia';
import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

import { env } from '@/env';
import { db } from '@/server/db';
import { sessions, users } from '@/server/db/schema';

const adapter = new DrizzleMySQLAdapter(db, sessions, users);

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    /**
     * This sets cookies with super long expiration since Next.js doesn't
     * allow Lucia to extend cookie expiration when rendering pages
     */
    expires: false,
    attributes: {
      // Set to `true` when using HTTPS
      secure: env.NODE_ENV === 'production'
    }
  },
  getUserAttributes: (attributes) => ({
    name: attributes.name,
    role: attributes.role,
    email: attributes.email,
    avatar: attributes.avatar,
    githubId: attributes.githubId
  })
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
  interface DatabaseUserAttributes {
    name: string;
    role: 'user' | 'bot' | 'moderator' | 'owner';
    email: string;
    avatar: string;
    githubId: number;
  }
}

export const getSessionId = (cookies: { get: RequestCookies['get'] } | null) =>
  cookies?.get(lucia.sessionCookieName)?.value ?? null;
