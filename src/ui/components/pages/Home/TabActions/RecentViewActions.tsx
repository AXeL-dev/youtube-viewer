import React, { useState, useMemo } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { StyledMenu } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TimerOffOutlinedIcon from '@mui/icons-material/TimerOffOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import Check from '@mui/icons-material/Check';
import { selectSettings } from 'store/selectors/settings';
import { setRecentVideosDisplayOptions } from 'store/reducers/settings';
import { RecentVideoDisplayOption, Nullable } from 'types';

interface RecentViewActionsProps {}

function RecentViewActions(props: RecentViewActionsProps) {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);
  const { hideViewedVideos, hideWatchLaterVideos } =
    settings.recentVideosDisplayOptions;
  const hasEnabledFilters = useMemo(() => {
    const options = Object.keys(
      settings.recentVideosDisplayOptions
    ) as RecentVideoDisplayOption[];
    return options.reduce(
      (acc, cur) => settings.recentVideosDisplayOptions[cur] || acc,
      false
    );
  }, [settings.recentVideosDisplayOptions]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterViewedToggle = () => {
    dispatch(
      setRecentVideosDisplayOptions({
        hideViewedVideos: !hideViewedVideos,
      })
    );
  };

  const handleFilterWatchLaterToggle = () => {
    dispatch(
      setRecentVideosDisplayOptions({
        hideWatchLaterVideos: !hideWatchLaterVideos,
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
        <MenuItem onClick={handleFilterViewedToggle}>
          <ListItemIcon>
            {hideViewedVideos ? (
              <Check />
            ) : (
              !hasEnabledFilters && <VisibilityOffIcon />
            )}
          </ListItemIcon>
          <ListItemText>Filter viewed videos</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleFilterWatchLaterToggle}>
          <ListItemIcon>
            {hideWatchLaterVideos ? (
              <Check />
            ) : (
              !hasEnabledFilters && <TimerOffOutlinedIcon />
            )}
          </ListItemIcon>
          <ListItemText>Filter watch later videos</ListItemText>
        </MenuItem>
      </StyledMenu>
    </>
  );
}

export default RecentViewActions;
