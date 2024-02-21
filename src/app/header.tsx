import { SiGithub } from '@icons-pack/react-simple-icons';
import { PlusIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeSwitcher } from '@/components/theme-switcher';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="container mb-4 flex flex-col">
      <div className="flex h-14 justify-between">
        <div className="flex items-center gap-1">
          <Link className="flex items-center gap-2" href="/">
            <Image src="/icon.png" alt="Logo" width={24} height={24} />
            <span className="text-xl font-semibold tracking-tighter">
              DevTerms
            </span>
          </Link>
          <span className="hidden text-sm tracking-tight text-muted-foreground sm:inline">
            &mdash; The developer dictionary
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
            href="/submit"
          >
            <PlusIcon className="size-4" />
          </Link>
          <Link
            className={buttonVariants({ variant: 'outline', size: 'icon' })}
            href="https://github.com/aelew/devterms"
            target="_blank"
          >
            <SiGithub className="size-4" />
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
      <div>
        <div className="relative flex items-center">
          <SearchIcon className="absolute ml-4 size-4 text-muted-foreground" />
          <Input
            className="h-auto rounded-lg py-3 pl-10 pr-4 shadow"
            placeholder="Search..."
          />
        </div>
      </div>
    </header>
  );
}
