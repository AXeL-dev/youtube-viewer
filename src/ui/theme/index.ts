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
        light: '#1a88ff',
        main: '#007bff',
        dark: '#006fe6',
      },
      // background: {
      //   default: mode === 'light' ? '#fff' : '#121212',
      // },
    },
  });

export default useTheme;
