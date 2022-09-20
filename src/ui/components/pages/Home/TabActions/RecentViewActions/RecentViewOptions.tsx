import React, { useState } from 'react';
import { IconButton, Divider } from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { HomeView, Nullable } from 'types';
import ViewSorting from '../CommonMenus/ViewSorting';
import ViewFilters, { ViewFilterOption } from '../CommonMenus/ViewFilters';
import RecentVideosSeniority from './Menus/RecentVideosSeniority';
import RecentViewMoreActions from './Menus/RecentViewMoreActions';

const options: ViewFilterOption[] = [
  {
    label: 'Seen',
    value: 'seen',
  },
  {
    label: 'Watch later',
    value: 'watchLater',
  },
  {
    label: 'Ignored',
    value: 'ignored',
  },
  {
    label: 'Others',
    value: 'others',
  },
];

interface RecentViewOptionsProps {}

function RecentViewOptions(props: RecentViewOptionsProps) {
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);

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
        <ViewSorting view={HomeView.Recent} parentMenuOpen={open} />
        <ViewFilters
          view={HomeView.Recent}
          parentMenuOpen={open}
          options={options}
        />
        <RecentVideosSeniority parentMenuOpen={open} />
        <Divider sx={{ my: 0.5 }} />
        <RecentViewMoreActions parentMenuOpen={open} />
      </StyledMenu>
    </>
  );
}

export default RecentViewOptions;
