'use client';

import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { Command as CommandPrimitive } from 'cmdk';
import { CheckIcon, SearchIcon } from 'lucide-react';
import { usePlausible } from 'next-plausible';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { env } from '@/env';
import { termToSlug } from '@/lib/utils';
import type { Events } from '@/types';

const { searchClient } = instantMeiliSearch(env.NEXT_PUBLIC_MEILISEARCH_HOST, env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY, {
  placeholderSearch: false
});

type Hit = {
  id: string;
  term: string;
  definition: string;
  example: string;
};

export function SearchBar() {
  const [selectedHit, setSelectedHit] = useState<Hit | null>(null);
  const [debouncedValue, setDebouncedValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const [hits, setHits] = useState<Hit[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const plausible = usePlausible<Events>();
  const router = useRouter();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep hits displayed when typing
      if (!open) {
        setOpen(true);
      }

      if (event.key === 'Enter' && input.value.trim() !== '') {
        const hitToSelect = hits.find((hit) => hit.term === input.value.trim());
        if (hitToSelect) {
          setSelectedHit(hitToSelect);
        } else {
          router.push(`/define/${termToSlug(input.value.trim())}`);
          plausible('Search');
        }
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [router, hits, open, plausible]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    if (selectedHit) {
      setInputValue(selectedHit.term);
    }
  }, [selectedHit]);

  const handleValueChange = useCallback(
    (value: string) => {
      setInputValue(value);
      if (value.trim() === '') {
        setHits([]);
      }
    },
    [setInputValue]
  );

  const handleHitSelect = useCallback(
    (hit: Hit) => {
      setSelectedHit(selectedHit);
      setInputValue('');
      setOpen(false);
      inputRef.current?.blur();
      router.push(`/define/${termToSlug(hit.term)}`);
      plausible('Search');
    },
    [router, selectedHit, plausible]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue !== '') {
      searchClient
        .search<Hit>([
          {
            indexName: 'definitions',
            params: { hitsPerPage: 4 },
            query: debouncedValue
          }
        ])
        // @ts-expect-error SearchResponse
        .then(({ results }) => setHits(results[0].hits));
    }
  }, [debouncedValue]);

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div className="relative flex items-center">
        <SearchIcon className="absolute ml-4 size-4 text-muted-foreground" />
        <Input className="h-auto rounded-lg bg-background py-3 pl-10 pr-4 shadow" placeholder="Search..." asChild>
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onBlur={handleBlur}
            onValueChange={handleValueChange}
            onFocus={() => setOpen(true)}
          />
        </Input>
      </div>
      {open && hits.length > 0 && (
        <div className="relative">
          <CommandList>
            <CommandGroup className="absolute z-10 mt-2 w-full rounded-md border bg-popover p-1 shadow outline-none animate-in fade-in-0">
              {hits.map((hit) => {
                const isSelected = selectedHit?.id === hit.id;
                return (
                  <CommandItem
                    className="flex w-full items-center gap-2"
                    onSelect={() => handleHitSelect(hit)}
                    value={hit.term}
                    key={hit.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    {isSelected ? (
                      <CheckIcon className="size-4 shrink-0" />
                    ) : (
                      <SearchIcon className="size-4 shrink-0" />
                    )}
                    <p className="whitespace-nowrap">{hit.term}</p>
                    <p className="truncate text-[0.8rem] text-muted-foreground">{hit.definition}</p>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </div>
      )}
    </CommandPrimitive>
  );
}
