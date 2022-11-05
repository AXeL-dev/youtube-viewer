import React, { useState } from 'react';
import { IconButton, Divider } from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { HomeView, Nullable } from 'types';
import ViewSorting from '../CommonMenus/ViewSorting';
import ViewFilters, { ViewFilterOption } from '../CommonMenus/ViewFilters';
import ViewVideosSeniority from '../CommonMenus/ViewVideosSeniority';
import AllViewMoreActions from '../AllViewActions/Menus/AllViewMoreActions';
import ViewChannelOptions from '../CommonMenus/ViewChannelOptions';

const filterOptions: ViewFilterOption[] = [
  {
    label: 'Seen',
    value: 'seen',
  },
  {
    label: 'Watch later',
    value: 'watchLater',
  },
  {
    label: 'Bookmarked',
    value: 'bookmarked',
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

interface AllViewOptionsProps {}

function AllViewOptions(props: AllViewOptionsProps) {
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
        <ViewSorting view={HomeView.All} parentMenuOpen={open} />
        <ViewFilters
          view={HomeView.All}
          parentMenuOpen={open}
          options={filterOptions}
        />
        <ViewChannelOptions view={HomeView.All} parentMenuOpen={open} />
        <ViewVideosSeniority view={HomeView.All} parentMenuOpen={open} />
        <Divider sx={{ my: 0.5 }} />
        <AllViewMoreActions parentMenuOpen={open} />
      </StyledMenu>
    </>
  );
}

export default AllViewOptions;
