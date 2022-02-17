import React, { MouseEvent } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import Check from '@mui/icons-material/Check';

interface ICheckableMenuItemProps {
  children?: React.ReactNode;
  checked: boolean;
  onClick: (event: MouseEvent) => void;
}

export function CheckableMenuItem(props: ICheckableMenuItemProps) {
  const { children, checked, onClick } = props;

  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon>{checked ? <Check /> : null}</ListItemIcon>
      <ListItemText>{children}</ListItemText>
    </MenuItem>
  );
}
