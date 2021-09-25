import { useRef, useEffect } from 'react';

export function useDidMountEffect(callback?: () => void, deps?: any) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      if (callback) {
        callback();
      }
    } else {
      didMount.current = true;
    }
  }, deps);

  return didMount.current;
}
