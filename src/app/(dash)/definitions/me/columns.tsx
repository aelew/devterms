'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { match } from 'ts-pattern';

import { Time } from '@/components/time';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type Definition = {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  term: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
};

export const columns: ColumnDef<Definition>[] = [
  {
    header: 'Term',
    accessorKey: 'term'
  },
  {
    header: 'Status',
    accessorKey: 'status',
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
      b.original.createdAt.getTime() - a.original.createdAt.getTime(),
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4"
          variant="ghost"
        >
          Created
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">
        <Time date={getValue() as Date} />
      </div>
    )
  }
];
