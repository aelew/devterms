import { useCallback, useState } from 'react';

export const useCopyToClipboard = (timeoutDuration = 500) => {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setStatus('copied');
        setTimeout(() => setStatus('idle'), timeoutDuration);
      } catch (err) {
        setStatus('error');
      }
    },
    [timeoutDuration]
  );

  return { status, copy };
};
