import { SiGithub } from '@icons-pack/react-simple-icons';
import { generateState } from 'arctic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { github } from '@/lib/auth';

export function GitHubButton() {
  async function login() {
    'use server';
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
      scopes: ['user:email']
    });

    cookies().set('oauth_state', state, {
      secure: env.NODE_ENV === 'production',
      maxAge: 60 * 10,
      httpOnly: true,
      sameSite: 'lax',
      path: '/'
    });

    redirect(url.toString());
  }
  return (
    <form action={login}>
      <Button className="relative w-full" variant="outline">
        <SiGithub className="absolute left-[0.875rem] size-4" />
        <span>Continue with GitHub</span>
      </Button>
    </form>
  );
}
