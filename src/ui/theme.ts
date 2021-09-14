import { PaletteType } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const useTheme = (type: PaletteType = 'light') =>
  createTheme({
    palette: {
      type,
      primary: {
        main: '#f21718',
      },
      secondary: {
        main: '#b81112',
      },
      error: {
        main: red.A400,
      },
      background: {
        default: '#fff',
      },
    },
  });

export default useTheme;
