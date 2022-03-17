import { styled } from '@mui/material/styles';
import MuiSelect from '@mui/material/Select';

const Select = styled(MuiSelect)(({ theme }) => ({
  fontSize: '0.9rem',
  backgroundColor: theme.palette.background.default,
  '&.Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.secondary.light,
    },
  },
})) as unknown as typeof MuiSelect;

export default Select;
