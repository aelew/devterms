import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { github, lucia } from '@/lib/auth';
import { generateId } from '@/lib/id';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import type { GitHubUser } from '@/types';

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('oauth_state')?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json({ error: 'invalid_parameters' }, { status: 400 });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` }
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await db.query.users.findFirst({
      where: eq(users.githubId, githubUser.id)
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return NextResponse.redirect(new URL('/', url));
    }

    const userId = generateId('user');

    await db.insert(users).values({
      id: userId,
      name: githubUser.login,
      email: githubUser.email,
      avatar: githubUser.avatar_url,
      githubId: githubUser.id
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return NextResponse.redirect(new URL('/', url));
  } catch (err) {
    if (err instanceof OAuth2RequestError) {
      return NextResponse.json({ error: 'invalid_code' }, { status: 400 });
    }
    console.error('GitHub OAuth2 error:', err);
    return NextResponse.json(
      { error: 'internal_server_error' },
      { status: 500 }
    );
  }
}
