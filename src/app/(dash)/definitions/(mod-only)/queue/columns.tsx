'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon, CheckIcon, TrashIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Time } from '@/components/time';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { updatePendingDefinition } from './_actions';

export type Definition = {
  id: string;
  term: string;
  definition: string;
  example: string;
  createdAt: Date;
};

export const columns: ColumnDef<Definition>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mr-2"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
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
    accessorKey: 'term',
    header: 'Term'
  },
  {
    accessorKey: 'definition',
    header: 'Definition'
  },
  {
    accessorKey: 'example',
    header: 'Example'
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
            updatePendingDefinition({
              definitionId: row.original.id,
              action: 'approve'
            });
            toast.success('Definition approved!');
            // @ts-expect-error removeRow
            table.options.meta.removeRow(row.index);
          }}
        >
          <CheckIcon className="size-4" />
        </Button>
        <Button
          variant="destructive"
          className="size-8"
          size="icon"
          onClick={() => {
            updatePendingDefinition({
              definitionId: row.original.id,
              action: 'reject'
            });
            toast.success('Definition rejected!');
            // @ts-expect-error removeRow
            table.options.meta.removeRow(row.index);
          }}
        >
          <XIcon className="size-4" />
        </Button>
        <Button
          className="size-8 border border-input"
          variant="secondary"
          size="icon"
          onClick={() => {
            updatePendingDefinition({
              definitionId: row.original.id,
              action: 'delete'
            });
            toast.success('Definition deleted!');
            // @ts-expect-error removeRow
            table.options.meta.removeRow(row.index);
          }}
        >
          <TrashIcon className="size-3.5" />
        </Button>
      </div>
    )
  }
];
