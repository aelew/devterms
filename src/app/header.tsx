import { SearchIcon } from 'lucide-react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="container mb-4 flex flex-col">
      <div className="flex h-14">
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-1" href="/">
            <h1 className="text-xl font-semibold tracking-tighter">DevTerms</h1>
            <span className="hidden text-sm tracking-tight text-muted-foreground sm:inline">
              &mdash; The developer dictionary
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">{/* <ThemeSwitcher /> */}</div>
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
