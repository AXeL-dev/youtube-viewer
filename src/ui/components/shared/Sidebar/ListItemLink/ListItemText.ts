import { styled } from '@mui/material/styles';
import MuiListItemText from '@mui/material/ListItemText';

const ListItemText = styled(MuiListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    display: 'flex',
    alignItems: 'center',
  },
})) as typeof MuiListItemText;

export default ListItemText;
