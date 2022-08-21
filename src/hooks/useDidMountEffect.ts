import { useRef, useEffect, EffectCallback, DependencyList } from 'react';

export function useDidMountEffect(
  effect: EffectCallback,
  deps?: DependencyList,
) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      if (effect) {
        return effect();
      }
    } else {
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return didMount.current;
}
