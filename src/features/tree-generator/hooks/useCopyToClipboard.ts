import {useCallback, useEffect, useRef, useState} from 'react';

const RESET_DELAY_MS = 2000;

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const resetTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (text: string) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      copyWithTextareaFallback(text);
      setCopied(true);
    }

    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => setCopied(false), RESET_DELAY_MS);
  }, []);

  return {copied, copy};
}

function copyWithTextareaFallback(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  textArea.remove();
}
