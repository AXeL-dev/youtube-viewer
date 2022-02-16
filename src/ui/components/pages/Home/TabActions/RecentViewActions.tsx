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
import { selectViewFilters } from 'store/selectors/settings';
import { setViewFilters } from 'store/reducers/settings';
import { HomeView, Nullable } from 'types';

interface RecentViewActionsProps {
  hasVideos: boolean;
}

function RecentViewActions(props: RecentViewActionsProps) {
  const filters = useAppSelector(selectViewFilters(HomeView.Recent));
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
        view: HomeView.Recent,
        filters: {
          any: !filters.any,
        },
      })
    );
  };

  const handleViewedFilterToggle = () => {
    dispatch(
      setViewFilters({
        view: HomeView.Recent,
        filters: {
          viewed: !filters.viewed,
        },
      })
    );
  };

  const handleWatchLaterFilterToggle = () => {
    dispatch(
      setViewFilters({
        view: HomeView.Recent,
        filters: {
          watchLater: !filters.watchLater,
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
        <MenuItem onClick={handleWatchLaterFilterToggle}>
          <ListItemIcon>{filters.watchLater ? <Check /> : null}</ListItemIcon>
          <ListItemText>Watch later</ListItemText>
        </MenuItem>
      </StyledMenu>
    </>
  );
}

export default RecentViewActions;
