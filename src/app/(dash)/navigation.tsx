'use client';

import { BookMarkedIcon, ClockIcon, FlagIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils';

interface DashboardNavigationProps {
  isModerator: boolean;
}

export function DashboardNavigation({ isModerator }: DashboardNavigationProps) {
  const links = [
    {
      icon: BookMarkedIcon,
      color: 'text-green-600',
      label: 'My definitions',
      href: '/definitions/me'
    },
    ...(isModerator
      ? [
          {
            icon: ClockIcon,
            color: 'text-amber-600',
            label: 'Pending definitions',
            href: '/definitions/queue'
          },
          {
            icon: FlagIcon,
            color: 'text-destructive',
            label: 'Reported definitions',
            href: '/definitions/reports'
          }
        ]
      : [])
  ];
  const pathname = usePathname();
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={buttonVariants({
              variant: link.href === pathname ? 'secondary' : 'outline',
              className: 'border border-input'
            })}
          >
            <link.icon className={cn('mr-2 size-4', link.color)} /> {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
