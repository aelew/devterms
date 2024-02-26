import { SiGithub } from '@icons-pack/react-simple-icons';
import {
  ArrowRightIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  UserIcon
} from 'lucide-react';
import { cookies } from 'next/headers';
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
import { lucia } from '@/lib/auth';
import { getAuthData } from '@/lib/auth/helpers';
import { SearchBar } from './search-bar';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Browse', href: '/browse' },
  { label: 'Submit', href: '/submit' },
  { label: 'API', href: '/api/docs' }
];

export async function Header() {
  const { user } = await getAuthData();

  async function signOut() {
    'use server';
    const { user, session } = await getAuthData();
    if (!user) {
      throw new Error('Authentication required');
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }

  return (
    <header className="container mb-4 flex flex-col">
      <div className="flex h-14 justify-between">
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-2" href="/">
            <Image src="/icon.png" alt="Logo" width={24} height={24} />
            <span className="text-xl font-semibold tracking-tighter">
              DevTerms
            </span>
          </Link>
          <ul className="hidden gap-4 text-sm text-muted-foreground sm:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="block transition-color-transform hover:text-muted-foreground/80 active:scale-95"
                  prefetch={item.href !== '/api/docs'}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
            aria-label="Submit a definition"
            href="/submit"
          >
            <PlusIcon className="size-4" />
          </Link>
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
              <DropdownMenuTrigger className="rounded-full transition-opacity hover:opacity-80">
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
