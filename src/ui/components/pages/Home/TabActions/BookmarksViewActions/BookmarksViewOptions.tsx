import React, { useState } from 'react';
import { IconButton, Divider } from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { HomeView, Nullable } from 'types';
import ViewSorting from '../CommonMenus/ViewSorting';
import ViewFilters, { ViewFilterOption } from '../CommonMenus/ViewFilters';
import ViewVideosSeniority from '../CommonMenus/ViewVideosSeniority';
import BookmarksViewMoreActions from './Menus/BookmarksViewMoreActions';

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
    label: 'Others',
    value: 'others',
  },
];

interface BookmarksViewOptionsProps {
  videosCount: number;
}

function BookmarksViewOptions(props: BookmarksViewOptionsProps) {
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
        <ViewSorting view={HomeView.Bookmarks} parentMenuOpen={open} />
        <ViewFilters
          view={HomeView.Bookmarks}
          parentMenuOpen={open}
          options={filterOptions}
        />
        <ViewVideosSeniority view={HomeView.Bookmarks} parentMenuOpen={open} />
        <Divider sx={{ my: 0.5 }} />
        <BookmarksViewMoreActions
          parentMenuOpen={open}
          videosCount={videosCount}
        />
      </StyledMenu>
    </>
  );
}

export default BookmarksViewOptions;
