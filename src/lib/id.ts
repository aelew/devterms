import { alphabet, generateRandomString } from 'oslo/crypto';

export function generateId(prefix: string) {
  return `${prefix}_${generateRandomString(16, alphabet('a-z', 'A-Z', '0-9'))}`;
}
