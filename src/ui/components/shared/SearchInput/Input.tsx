import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const Input = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.custom.lightGrey,
  border: `1px solid ${theme.palette.custom.lightBorder}`,
  borderRadius: 20,
  '& .MuiInputBase-input': {
    padding: theme.spacing(0, 5, 0, 6),
    width: '100%',
  },
}));

export default Input;
