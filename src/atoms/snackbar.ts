import { atom } from 'jotai';
import { Getter } from 'jotai/core/types';

export interface SnackbarOptions {
  isOpen: boolean,
  message: string,
  key?: number,
  autoHideDuration?: number,
  showRefreshButton?: boolean
}

export const defaultSnackbarOptions: Omit<SnackbarOptions, 'isOpen' | 'message' | 'key'> = {
  autoHideDuration: 5000,
  showRefreshButton: true
};

export const snackbarAtom = atom({
  isOpen: false,
  message: '',
  autoHideDuration: defaultSnackbarOptions.autoHideDuration,
  showRefreshButton: defaultSnackbarOptions.showRefreshButton
} as SnackbarOptions);

const snackbarClosedState = (get: Getter) => ({
  ...get(snackbarAtom), // previous state
  isOpen: false,
  key: undefined
});

export const openSnackbarAtom = atom( // write-only
  null,
  (get, set, args: SnackbarOptions|any) => {
    // close old snackbar
    if (get(snackbarAtom).isOpen) {
      set(snackbarAtom, snackbarClosedState(get));
    }
    // open a new one
    set(snackbarAtom, {
      isOpen: true,
      message: args.message || args,
      key: new Date().getTime(),
      autoHideDuration: args.autoHideDuration || defaultSnackbarOptions.autoHideDuration,
      showRefreshButton: args.showRefreshButton !== undefined ? args.showRefreshButton : defaultSnackbarOptions.showRefreshButton // don't use OR operator with boolean values, since false || true === true (not false)
    });
  }
);

export const closeSnackbarAtom = atom( // write-only
  null,
  (get, set) => set(snackbarAtom, snackbarClosedState(get))
);
