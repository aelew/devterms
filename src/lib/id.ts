import { generateRandomString, type RandomReader } from '@oslojs/crypto/random';

const ID_ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateId(prefix: string) {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    }
  };

  const randomId = generateRandomString(random, ID_ALPHABET, 16);
  return `${prefix}_${randomId}`;
}
