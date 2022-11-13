import { MutableRefObject } from 'react';
import { EqualityFn, NoInfer } from 'react-redux';
import { RootState, useAppSelector } from 'store';
import { useStateRef } from './useStateRef';

interface UseSelectorRefHook<TState> {
  <TSelected>(
    selector: (state: TState) => TSelected,
    equalityFn?: EqualityFn<NoInfer<TSelected>>,
  ): MutableRefObject<TSelected>;
}

export const useSelectorRef: UseSelectorRefHook<RootState> = (...params) => {
  const selected = useAppSelector(...params);
  const ref = useStateRef(selected);
  return ref;
};
