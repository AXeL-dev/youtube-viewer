import { atom } from 'jotai';

export interface SnackbarOptions {
  isOpen: boolean,
  message: string,
  autoHideDuration?: number,
  showRefreshButton?: boolean
}

export const defaultSnackbarOptions: Omit<SnackbarOptions, 'isOpen' | 'message'> = {
  autoHideDuration: 5000,
  showRefreshButton: true
};

export const snackbarAtom = atom({
  isOpen: false,
  message: '',
  autoHideDuration: defaultSnackbarOptions.autoHideDuration,
  showRefreshButton: defaultSnackbarOptions.showRefreshButton
} as SnackbarOptions);

export const openSnackbarAtom = atom( // write-only
  null,
  (get, set, args: SnackbarOptions|any) => set(snackbarAtom, {
    isOpen: true,
    message: args.message || args,
    autoHideDuration: args.autoHideDuration || defaultSnackbarOptions.autoHideDuration,
    showRefreshButton: args.showRefreshButton !== undefined ? args.showRefreshButton : defaultSnackbarOptions.showRefreshButton // don't use OR operator with boolean values, since false || true === true (not false)
  })
);

export const closeSnackbarAtom = atom( // write-only
  null,
  (get, set) => set(snackbarAtom, {
    isOpen: false,
    message: get(snackbarAtom).message,
    autoHideDuration: get(snackbarAtom).autoHideDuration,
    showRefreshButton: get(snackbarAtom).showRefreshButton
  })
);
