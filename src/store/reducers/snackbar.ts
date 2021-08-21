import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackbarOptions, Snackbar } from 'models';

export const defaultSnackbarOptions: Omit<SnackbarOptions, 'message'> = {
  icon: 'info',
  autoHideDuration: 5000,
  showRefreshButton: false,
};

interface snackbarState extends Snackbar {}

const initialState: snackbarState = {
  isOpen: false,
  message: '',
  icon: defaultSnackbarOptions.icon,
  autoHideDuration: defaultSnackbarOptions.autoHideDuration,
  showRefreshButton: defaultSnackbarOptions.showRefreshButton,
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (state, action: PayloadAction<SnackbarOptions | string>) => {
      const options = action.payload as SnackbarOptions;
      // close old snackbar
      if (state.isOpen) {
        snackbarSlice.caseReducers.closeSnackbar(state);
      }
      // open a new one
      state = {
        isOpen: true,
        message: options.message || (action.payload as string),
        key: new Date().getTime(),
        icon: options.icon || defaultSnackbarOptions.icon,
        autoHideDuration: options.autoHideDuration || defaultSnackbarOptions.autoHideDuration,
        showRefreshButton:
          options.showRefreshButton !== undefined
            ? options.showRefreshButton
            : defaultSnackbarOptions.showRefreshButton, // don't use OR operator with boolean values, since false || true === true (not false)
      };
    },
    closeSnackbar: (state) => {
      state.isOpen = false;
      state.key = undefined;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
