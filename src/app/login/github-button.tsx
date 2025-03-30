'use client';

import { SiGithub } from '@icons-pack/react-simple-icons';
import { usePlausible } from 'next-plausible';

import { Button } from '@/components/ui/button';
import type { Events } from '@/types';
import { login } from './_actions';

export function GitHubButton() {
  const plausible = usePlausible<Events>();
  return (
    <form action={login}>
      <Button
        onClick={() => plausible('Login')}
        className="w-full gap-2"
        variant="outline"
      >
        <SiGithub className="size-4" />
        <span>Continue with GitHub</span>
      </Button>
    </form>
  );
}
