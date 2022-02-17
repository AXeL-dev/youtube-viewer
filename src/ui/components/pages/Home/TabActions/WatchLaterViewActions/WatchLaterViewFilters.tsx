import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { StyledMenu, CheckableMenuItem } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import FilterListIcon from '@mui/icons-material/FilterList';
import { HomeView, Nullable } from 'types';
import { selectViewFilters } from 'store/selectors/settings';
import { setViewFilters } from 'store/reducers/settings';

interface WatchLaterViewFiltersProps {}

function WatchLaterViewFilters(props: WatchLaterViewFiltersProps) {
  const filters = useAppSelector(selectViewFilters(HomeView.WatchLater));
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAnyFilterToggle = () => {
    dispatch(
      setViewFilters({
        view: HomeView.WatchLater,
        filters: {
          any: !filters.any,
        },
      })
    );
  };

  const handleViewedFilterToggle = () => {
    dispatch(
      setViewFilters({
        view: HomeView.WatchLater,
        filters: {
          viewed: !filters.viewed,
        },
      })
    );
  };

  const handleArchivedFilterToggle = () => {
    dispatch(
      setViewFilters({
        view: HomeView.WatchLater,
        filters: {
          archived: !filters.archived,
        },
      })
    );
  };

  return (
    <>
      <IconButton
        id="filter-button"
        aria-label="filter"
        aria-controls={open ? 'filter-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FilterListIcon />
      </IconButton>
      <StyledMenu
        id="filter-menu"
        MenuListProps={{
          'aria-labelledby': 'filter-button',
          dense: true,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <CheckableMenuItem
          checked={filters.any}
          onClick={handleAnyFilterToggle}
        >
          Any
        </CheckableMenuItem>
        <CheckableMenuItem
          checked={filters.viewed}
          onClick={handleViewedFilterToggle}
        >
          Viewed
        </CheckableMenuItem>
        <CheckableMenuItem
          checked={filters.archived!}
          onClick={handleArchivedFilterToggle}
        >
          Archived
        </CheckableMenuItem>
      </StyledMenu>
    </>
  );
}

export default WatchLaterViewFilters;
