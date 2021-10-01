import { styled, Theme } from '@mui/material/styles';
import MuiListItemButton from '@mui/material/ListItemButton';

const ListItemSelectedStyle = (theme: Theme) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '& .MuiListItemIcon-root': {
    color: '#fff',
  },
});

const ListItem = styled(MuiListItemButton)(({ theme }) => ({
  borderRadius: '5px 0 0 5px',
  marginBottom: theme.spacing(1),
  '&.Mui-selected': ListItemSelectedStyle(theme),
  '&.Mui-selected:hover': ListItemSelectedStyle(theme),
})) as typeof MuiListItemButton;

export default ListItem;
