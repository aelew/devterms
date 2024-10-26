import { createSafeActionClient } from 'next-safe-action';

import { getCurrentSession } from './auth';
import { GENERIC_ERROR } from './utils';

export class ActionError extends Error {
  constructor(message = GENERIC_ERROR) {
    super(message);
  }
}

export const action = createSafeActionClient({
  handleReturnedServerError: (err) => {
    return err instanceof ActionError ? err.message : GENERIC_ERROR;
  }
});

export const protectedAction = createSafeActionClient({
  handleReturnedServerError: (e) => {
    return e instanceof ActionError ? e.message : GENERIC_ERROR;
  },
  middleware: async () => {
    const data = await getCurrentSession();
    if (!data.user) {
      throw new ActionError('Authentication required');
    }
    return data;
  }
});

export const moderatorAction = createSafeActionClient({
  handleReturnedServerError: (e) => {
    return e instanceof ActionError ? e.message : GENERIC_ERROR;
  },
  middleware: async () => {
    const data = await getCurrentSession();
    if (!data.user) {
      throw new ActionError('Authentication required');
    }
    if (data.user.role !== 'moderator' && data.user.role !== 'owner') {
      throw new ActionError('Insufficient permissions');
    }
    return data;
  }
});
