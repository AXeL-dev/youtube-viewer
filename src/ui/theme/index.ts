import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import './fonts';

const useTheme = (mode: PaletteMode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: '#e9321a',
        main: '#f21718',
        dark: '#b81112',
      },
      secondary: {
        light: '#3a98df',
        main: '#0074e8',
      },
      background: {
        default: '#fff',
      },
    },
  });

export default useTheme;
