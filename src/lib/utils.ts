import { clsx, type ClassValue } from 'clsx';
import type { HookResult } from 'next-safe-action/hooks';
import { twMerge } from 'tailwind-merge';
import type { Schema } from 'zod';

export const GENERIC_ERROR = 'Uh oh! An unexpected error occurred.';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getActionErrorMessage = (
  result: Omit<HookResult<Schema, unknown>, 'data'>
) => {
  if (result.serverError) {
    return result.serverError;
  }
  const validationErrors = Object.values(result.validationErrors ?? []);
  if (validationErrors.length) {
    return validationErrors[0]!.toString();
  }
  return GENERIC_ERROR;
};
