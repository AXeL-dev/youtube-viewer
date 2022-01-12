import { useEffect, useRef } from 'react';
import { Nullable } from 'types';

export function useInterval(callback: () => void, delay: Nullable<number>) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
