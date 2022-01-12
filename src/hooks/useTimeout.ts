import { useEffect, useRef } from 'react';
import { Nullable } from 'types';

export function useTimeout(callback: () => void, delay: Nullable<number>) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setTimeout(() => savedCallback.current(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}
