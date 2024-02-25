import { clsx, type ClassValue } from 'clsx';
import type { HookResult } from 'next-safe-action/hooks';
import { twMerge } from 'tailwind-merge';
import type { Schema } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getActionErrorMessage(result: Omit<HookResult<Schema, unknown>, 'data'>) {
  if (result.serverError) {
    return result.serverError;
  }
  const validationErrors = Object.values(result.validationErrors ?? []);
  if (validationErrors.length) {
    return validationErrors[0]!.toString();
  }
  return GENERIC_ERROR;
}

export function termToSlug(term: string) {
  return encodeURIComponent(term.replaceAll('-', '--').replaceAll(' ', '-').toLowerCase());
}

export function slugToTerm(slug: string) {
  return decodeURIComponent(slug).replaceAll('-', ' ').replaceAll('  ', '-');
}

export const GENERIC_ERROR = 'Uh oh! An unexpected error occurred.';

export const CATEGORIES = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'new'
];
