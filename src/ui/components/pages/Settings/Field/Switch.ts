import { styled } from '@mui/material/styles';
import MuiSwitch from '@mui/material/Switch';

const Switch = styled(MuiSwitch)(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,
  display: 'flex',
  '& .MuiSwitch-switchBase': {
    padding: 3,
    color: theme.palette.grey[500],
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 14,
    height: 14,
    boxShadow: 'none',
  },
  '& .MuiSwitch-track': {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 20 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.common.white
        : 'transparent',
  },
}));

export default Switch;
