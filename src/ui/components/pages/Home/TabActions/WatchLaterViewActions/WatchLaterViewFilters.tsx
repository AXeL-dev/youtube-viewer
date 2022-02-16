import React, { useState } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import FilterListIcon from '@mui/icons-material/FilterList';
import Check from '@mui/icons-material/Check';
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
        <MenuItem onClick={handleAnyFilterToggle}>
          <ListItemIcon>{filters.any ? <Check /> : null}</ListItemIcon>
          <ListItemText>Any</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleViewedFilterToggle}>
          <ListItemIcon>{filters.viewed ? <Check /> : null}</ListItemIcon>
          <ListItemText>Viewed</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleArchivedFilterToggle}>
          <ListItemIcon>{filters.archived ? <Check /> : null}</ListItemIcon>
          <ListItemText>Archived</ListItemText>
        </MenuItem>
      </StyledMenu>
    </>
  );
}

export default WatchLaterViewFilters;
