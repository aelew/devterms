'use server';

import { redirect } from 'next/navigation';

import { getRandomDefinition } from '@/lib/definitions';
import { termToSlug } from '@/lib/utils';

export async function showRandomDefinition() {
  const definition = await getRandomDefinition();
  if (!definition) {
    throw new Error('No definitions available');
  }
  redirect(`/define/${termToSlug(definition.term)}`);
}
