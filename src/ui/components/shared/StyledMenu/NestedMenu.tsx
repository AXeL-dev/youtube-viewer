import React, { useState, useImperativeHandle } from 'react';
import { StyledMenu } from 'ui/components/shared';
import { Nullable } from 'types';
import { MenuProps } from '@mui/material/Menu';

export interface NestedMenuRef {
  open: (event: React.MouseEvent<HTMLElement>) => void;
  close: () => void;
}

interface NestedMenuProps
  extends Omit<MenuProps, 'anchorEl' | 'open' | 'onClose'> {}

const NestedMenu = React.forwardRef<NestedMenuRef, NestedMenuProps>(
  (props, ref) => {
    const { children, ...rest } = props;
    const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
    const open = Boolean(anchorEl);

    useImperativeHandle(ref, () => ({
      open: (event) => {
        setAnchorEl(event.currentTarget);
      },
      close: handleClose,
    }));

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <StyledMenu
        id="nested-menu"
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        {...rest}
        style={{
          marginTop: 0,
          marginLeft: -1,
          ...rest.style,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {children}
      </StyledMenu>
    );
  },
);

export default NestedMenu;
