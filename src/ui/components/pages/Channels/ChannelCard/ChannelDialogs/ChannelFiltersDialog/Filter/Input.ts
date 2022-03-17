import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const Input = styled(InputBase)(({ theme }) => ({
  borderRadius: 4,
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${
    theme.palette.mode === 'light'
      ? 'rgba(0, 0, 0, 0.23)'
      : 'rgba(255, 255, 255, 0.23)'
  }`,
  fontSize: '0.9rem',
  width: 'auto',
  minWidth: 320,
  padding: theme.spacing(1, 1.5),
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:focus-within': {
    boxShadow: `${alpha(theme.palette.secondary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.secondary.main,
  },
  '& .MuiInputBase-input': {
    padding: 0,
  },
  '& .MuiInputAdornment-root': {
    marginLeft: theme.spacing(0.75),
    '& .MuiButtonBase-root': {
      padding: theme.spacing(0.75, 1),
      '& > svg': {
        width: '0.85em',
      },
    },
  },
}));

export default Input;
