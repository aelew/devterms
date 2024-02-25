'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { MonitorIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const ActiveIcon = <span className="absolute right-3 size-1.5 rounded-full bg-green-600" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <SunIcon className="mr-2 size-4" /> Light
          {theme === 'light' && ActiveIcon}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <MoonIcon className="mr-2 size-4" /> Dark
          {theme === 'dark' && ActiveIcon}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <MonitorIcon className="mr-2 size-4" /> System
          {theme === 'system' && ActiveIcon}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
