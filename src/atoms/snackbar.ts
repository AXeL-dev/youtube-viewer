import { atom } from 'jotai';

export interface SnackbarOptions {
  message: string,
  autoHideDuration?: number,
  showRefreshButton?: boolean
}

export const defaultSnackbarOptions: Omit<SnackbarOptions, 'message'> = {
  autoHideDuration: 5000,
  showRefreshButton: true
};

export const snackbarAtom = atom({
  message: '',
  autoHideDuration: defaultSnackbarOptions.autoHideDuration,
  showRefreshButton: defaultSnackbarOptions.showRefreshButton
});

export const openSnackbarAtom = atom( // write-only
  null,
  (get, set, args: SnackbarOptions|any) => set(snackbarAtom, {
    message: args.message || args,
    autoHideDuration: args.autoHideDuration || defaultSnackbarOptions.autoHideDuration,
    showRefreshButton: args.showRefreshButton !== undefined ? args.showRefreshButton : defaultSnackbarOptions.showRefreshButton
  })
);

export const closeSnackbarAtom = atom( // write-only
  null,
  (get, set) => set(snackbarAtom, {
    message: '',
    autoHideDuration: get(snackbarAtom).autoHideDuration,
    showRefreshButton: get(snackbarAtom).showRefreshButton
  })
);
