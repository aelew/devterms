'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { match } from 'ts-pattern';

import { Time } from '@/components/time';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { termToSlug } from '@/lib/utils';
import type { Timestamp } from '@/types';

export type Definition = {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  term: string;
  upvotes: number;
  downvotes: number;
  createdAt: Timestamp;
};

export const columns: ColumnDef<Definition>[] = [
  {
    header: 'Term',
    cell: ({ row }) => {
      return (
        <Link
          className="font-medium hover:underline hover:underline-offset-4"
          href={`/define/${termToSlug(row.original.term)}#${row.original.id}`}
        >
          {row.original.term}
        </Link>
      );
    }
  },
  {
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={match(status)
            .with('approved', () => 'success' as const)
            .with('pending', () => 'secondary' as const)
            .with('rejected', () => 'destructive' as const)
            .exhaustive()}
        >
          {status}
        </Badge>
      );
    }
  },
  {
    header: 'Upvotes',
    accessorKey: 'upvotes'
  },
  {
    header: 'Downvotes',
    accessorKey: 'downvotes'
  },
  {
    accessorKey: 'createdAt',
    sortingFn: (a, b) =>
      new Date(b.original.createdAt).getTime() -
      new Date(a.original.createdAt).getTime(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
          variant="ghost"
        >
          Created
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="whitespace-nowrap">
          <Time timestamp={getValue() as Timestamp} />
        </div>
      );
    }
  }
];
