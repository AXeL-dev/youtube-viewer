import { PaletteType } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const useTheme = (type: PaletteType = 'light') =>
  createTheme({
    palette: {
      type,
      primary: {
        main: '#fff', //'#f44336',
      },
      secondary: {
        main: '#e50023',
      },
      error: {
        main: red.A400,
      },
      background: {
        default: '#f9f9f9',
      },
    },
  });

export default useTheme;
