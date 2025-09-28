import { SiGithub } from '@icons-pack/react-simple-icons';
import {
  ArrowRightIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserIcon
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  deleteSessionCookie,
  getCurrentSession,
  invalidateSession
} from '@/lib/auth';
import { SearchBar } from './search-bar';

export async function Header() {
  const { user } = await getCurrentSession();

  const navLinkClassName =
    'block transition-color-transform hover:text-muted-foreground/80 active:scale-95';

  async function signOut() {
    'use server';

    const { user, session } = await getCurrentSession();
    if (!user) {
      throw new Error('Authentication required');
    }

    await invalidateSession(session.id);
    await deleteSessionCookie();
  }

  return (
    <header className="container mb-4 flex flex-col">
      <div className="flex h-14 justify-between">
        <div className="flex items-center gap-4">
          <Link
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
            href="/"
          >
            <Image src="/logo.png" alt="Logo" width={28} height={28} />
            <span className="text-xl font-semibold tracking-tighter">
              DevTerms
            </span>
          </Link>
          <ul className="hidden gap-4 text-sm text-muted-foreground sm:flex">
            {[
              { label: 'Home', href: '/' },
              { label: 'Browse', href: '/browse' },
              { label: 'Submit', href: '/submit' }
            ].map((item) => (
              <li key={item.href}>
                <Link className={navLinkClassName} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                className={navLinkClassName}
                prefetch={false}
                href="/api/docs"
                target="_blank"
              >
                API
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
            href="https://github.com/aelew/devterms"
            aria-label="GitHub"
            target="_blank"
          >
            <SiGithub className="size-4" />
          </Link>
          <ThemeSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="rounded-full transition-opacity hover:opacity-80"
                aria-label="User menu"
              >
                <Avatar>
                  <AvatarImage src={user.avatar + '&s=64'} />
                  <AvatarFallback>
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <p>{user.name}</p>
                  <p className="font-normal text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/u/${user.name}`}>
                    <UserIcon className="mr-2 size-4" />
                    View profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/definitions/me">
                    <LayoutDashboardIcon className="mr-2 size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <form action={signOut}>
                  <DropdownMenuItem asChild>
                    <button className="w-full">
                      <LogOutIcon className="mr-2 size-4" /> Sign out
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              className={buttonVariants({ className: 'group' })}
              href="/login"
            >
              Sign in
              <ArrowRightIcon className="ml-1 h-4 w-4 translate-x-0 transition-transform duration-200 ease-in-out group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
      <SearchBar />
    </header>
  );
}
