import { atom } from 'jotai';
import { Getter } from 'jotai/core/types';
import { SnackbarOptions, Snackbar } from '../models/Snackbar';

export const defaultSnackbarOptions: Omit<SnackbarOptions, 'message'> = {
  icon: 'info',
  autoHideDuration: 5000,
  showRefreshButton: false
};

export const snackbarAtom = atom({
  isOpen: false,
  message: '',
  icon: defaultSnackbarOptions.icon,
  autoHideDuration: defaultSnackbarOptions.autoHideDuration,
  showRefreshButton: defaultSnackbarOptions.showRefreshButton
} as Snackbar);

const snackbarClosedState = (get: Getter) => ({
  ...get(snackbarAtom), // previous state
  isOpen: false,
  key: undefined
});

export const openSnackbarAtom = atom( // write-only
  null,
  (get, set, args: SnackbarOptions) => {
    // close old snackbar
    if (get(snackbarAtom).isOpen) {
      set(snackbarAtom, snackbarClosedState(get));
    }
    // open a new one
    set(snackbarAtom, {
      isOpen: true,
      message: args.message || args as any,
      key: new Date().getTime(),
      icon: args.icon || defaultSnackbarOptions.icon,
      autoHideDuration: args.autoHideDuration || defaultSnackbarOptions.autoHideDuration,
      showRefreshButton: args.showRefreshButton !== undefined ? args.showRefreshButton : defaultSnackbarOptions.showRefreshButton // don't use OR operator with boolean values, since false || true === true (not false)
    });
  }
);

export const closeSnackbarAtom = atom( // write-only
  null,
  (get, set) => set(snackbarAtom, snackbarClosedState(get))
);
