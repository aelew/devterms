'use server';

import { redirect } from 'next/navigation';

import { getRandomDefinition } from '@/lib/definitions';

export async function showRandomDefinition() {
  const definition = await getRandomDefinition();
  if (!definition) {
    throw new Error('No definitions available');
  }
  redirect(`/define/${definition.term}`);
}
