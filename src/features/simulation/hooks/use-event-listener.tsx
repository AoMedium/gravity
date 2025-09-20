import { useEffect } from 'react';

export default function useEventListener(
  type: keyof WindowEventMap,
  listener: any,
  deps: any[],
) {
  useEffect(() => {
    window.addEventListener(type, listener);

    return () => {
      window.removeEventListener(type, listener);
    };
  }, deps);
}
