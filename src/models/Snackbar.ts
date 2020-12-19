
export interface SnackbarOptions {
  message: string,
  icon?: SnackbarIcon,
  autoHideDuration?: number,
  showRefreshButton?: boolean
}

export type SnackbarIcon = 'error' | 'info' | 'success' | 'warning';

export interface Snackbar extends SnackbarOptions {
  isOpen: boolean,
  key?: string|number
}
