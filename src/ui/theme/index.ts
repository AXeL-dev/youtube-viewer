import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { light } from '@mui/material/styles/createPalette';
import './fonts';
import './styles.css';

declare module '@mui/material/styles' {
  interface CustomColors {
    lightGrey: string;
    lightBorder: string;
  }
  interface Palette {
    custom: CustomColors;
  }
  interface PaletteOptions {
    custom: CustomColors;
  }
  interface BreakpointOverrides {
    xxs: true;
  }
}

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
      ...(mode === 'light'
        ? {
            background: {
              default: '#fff',
            },
            custom: {
              lightGrey: '#fafafa',
              lightBorder: light.divider,
            },
          }
        : {
            background: {
              default: '#181818',
            },
            custom: {
              lightGrey: '#212121',
              lightBorder: 'rgba(255, 255, 255, 0.23)',
            },
          }),
    },
    breakpoints: {
      values: {
        xxs: 0,
        xs: 780,
        sm: 1000,
        md: 1200,
        lg: 1400,
        xl: 1600,
      },
    },
  });

export default useTheme;
