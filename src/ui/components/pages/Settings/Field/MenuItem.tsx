import { styled, Theme } from '@mui/material/styles';
import MuiMenuItem from '@mui/material/MenuItem';

const MenuItemSelectedStyle = (theme: Theme) => ({
  backgroundColor: theme.palette.secondary.light,
  color: theme.palette.common.white,
});

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  fontSize: '0.9rem',
  '&.Mui-selected': {
    ...MenuItemSelectedStyle(theme),
    '&.Mui-focusVisible': MenuItemSelectedStyle(theme),
  },
  '&.Mui-selected:hover': MenuItemSelectedStyle(theme),
})) as typeof MuiMenuItem;

export default MenuItem;
