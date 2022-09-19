import React, { useRef, useState } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SortIcon from '@mui/icons-material/Sort';
import { HomeView, Nullable } from 'types';
import { NestedMenuRef } from 'ui/components/shared/StyledMenu/NestedMenu';
import ViewSorting from '../common/ViewSorting';

interface AllViewOptionsProps {}

function AllViewOptions(props: AllViewOptionsProps) {
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);
  const menusRef = useRef<{ [key: string]: NestedMenuRef | null }>({
    sorting: null,
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="more-button"
        aria-label="more"
        aria-controls={open ? 'more-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="more-menu"
        MenuListProps={{
          'aria-labelledby': 'more-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={menusRef.current['sorting']?.open}>
          <ListItemIcon>
            <SortIcon />
          </ListItemIcon>
          <ListItemText>Sort by</ListItemText>
        </MenuItem>
      </StyledMenu>
      <ViewSorting
        ref={(ref) => (menusRef.current['sorting'] = ref)}
        view={HomeView.All}
      />
    </>
  );
}

export default AllViewOptions;
