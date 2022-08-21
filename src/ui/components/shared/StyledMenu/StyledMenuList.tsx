import { styled, alpha } from '@mui/material/styles';
import MenuList, { MenuListProps } from '@mui/material/MenuList';
import React from 'react';

export const StyledMenuList = styled(
  React.forwardRef((props: MenuListProps, ref: React.Ref<HTMLUListElement>) => (
    <MenuList dense {...props} ref={ref} />
  )),
)(({ theme }) => ({
  borderRadius: 6,
  color:
    theme.palette.mode === 'light'
      ? 'rgb(55, 65, 81)'
      : theme.palette.grey[300],
  '& .MuiMenuItem-root': {
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.action.selected,
        theme.palette.action.selectedOpacity,
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.action.selected,
          theme.palette.action.focusOpacity,
        ),
      },
    },
    '& .MuiSvgIcon-root': {
      fontSize: 18,
      marginRight: theme.spacing(1.5),
      '&:not(.inherit-color)': {
        color: theme.palette.text.secondary,
      },
    },
    '&:active': {
      backgroundColor: alpha(
        theme.palette.action.selected,
        theme.palette.action.selectedOpacity,
      ),
    },
  },
}));
