import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const Input = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.25, 4, 0.75, 6),
    width: '100%',
  },
}));

export default Input;
