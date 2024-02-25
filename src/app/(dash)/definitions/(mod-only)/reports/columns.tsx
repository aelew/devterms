'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon, CheckIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Time } from '@/components/time';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { acknowledgeReport } from './_actions';

export type Report = {
  id: string;
  reason: string;
  user: {
    name: string | null;
  };
  definition: {
    term: string;
    definition: string;
    example: string;
  };
  createdAt: Date;
};

export const columns: ColumnDef<Report>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mr-2"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    header: 'User',
    cell: ({ row }) => row.original.user.name ?? 'Deleted User'
  },
  {
    header: 'Term',
    accessorFn: (row) => row.definition?.term
  },
  {
    header: 'Definition',
    accessorFn: (row) => row.definition?.definition
  },
  {
    header: 'Example',
    accessorFn: (row) => row.definition?.example
  },
  {
    header: 'Reason',
    accessorKey: 'reason'
  },
  {
    accessorKey: 'createdAt',
    sortingFn: (a, b) => b.original.createdAt.getTime() - a.original.createdAt.getTime(),
    header: ({ column }) => {
      return (
        <Button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="-ml-4" variant="ghost">
          Created
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap">
        <Time mode="short" date={getValue() as Date} />
      </div>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => (
      <div className="flex justify-end gap-2">
        <Button
          className="size-8 bg-green-600 text-white hover:bg-green-600/80"
          size="icon"
          onClick={() => {
            acknowledgeReport({ reportId: row.original.id });
            toast.success('Report acknowledged!');
            // @ts-expect-error removeRow
            table.options.meta.removeRow(row.index);
          }}
        >
          <CheckIcon className="size-4" />
        </Button>
      </div>
    )
  }
];
