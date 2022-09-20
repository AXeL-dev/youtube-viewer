import React, { useState } from 'react';
import { IconButton, Divider } from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { HomeView, Nullable } from 'types';
import ViewSorting from '../CommonMenus/ViewSorting';
import ViewFilters, { ViewFilterOption } from '../CommonMenus/ViewFilters';
import WatchLaterViewMoreActions from './Menus/WatchLaterViewMoreActions';

const options: ViewFilterOption[] = [
  {
    label: 'Seen',
    value: 'seen',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
  {
    label: 'Others',
    value: 'others',
  },
];

interface WatchLaterViewOptionsProps {
  videosCount: number;
}

function WatchLaterViewOptions(props: WatchLaterViewOptionsProps) {
  const { videosCount } = props;
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
        <ViewSorting view={HomeView.WatchLater} parentMenuOpen={open} />
        <ViewFilters
          view={HomeView.WatchLater}
          parentMenuOpen={open}
          options={options}
        />
        <Divider sx={{ my: 0.5 }} />
        <WatchLaterViewMoreActions
          parentMenuOpen={open}
          videosCount={videosCount}
        />
      </StyledMenu>
    </>
  );
}

export default WatchLaterViewOptions;
