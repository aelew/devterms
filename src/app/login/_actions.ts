'use server';

import { generateState } from 'arctic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { env } from '@/env';
import { github } from '@/lib/auth';

export async function login() {
  'use server';

  const state = generateState();
  const url = await github.createAuthorizationURL(state, ['user:email']);

  const cookieStore = await cookies();

  cookieStore.set('oauth_state', state, {
    secure: env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  });

  redirect(url.toString());
}
