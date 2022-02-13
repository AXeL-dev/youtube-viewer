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
import ArchiveIcon from '@mui/icons-material/Archive';
import FilterListIcon from '@mui/icons-material/FilterList';
import Check from '@mui/icons-material/Check';
import { Nullable, WatchLaterVideoDisplayOption } from 'types';
import { selectSettings } from 'store/selectors/settings';
import { setWatchLaterVideosDisplayOptions } from 'store/reducers/settings';

interface WatchLaterViewFiltersProps {}

function WatchLaterViewFilters(props: WatchLaterViewFiltersProps) {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);
  const { hideViewedVideos, hideArchivedVideos } =
    settings.watchLaterVideosDisplayOptions;
  const hasEnabledFilters = useMemo(() => {
    const options = Object.keys(
      settings.watchLaterVideosDisplayOptions
    ) as WatchLaterVideoDisplayOption[];
    return options.reduce(
      (acc, cur) => settings.watchLaterVideosDisplayOptions[cur] || acc,
      false
    );
  }, [settings.watchLaterVideosDisplayOptions]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterViewedToggle = () => {
    dispatch(
      setWatchLaterVideosDisplayOptions({
        hideViewedVideos: !hideViewedVideos,
      })
    );
  };

  const handleFilterArchivedToggle = () => {
    dispatch(
      setWatchLaterVideosDisplayOptions({
        hideArchivedVideos: !hideArchivedVideos,
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
        <MenuItem onClick={handleFilterArchivedToggle}>
          <ListItemIcon>
            {hideArchivedVideos ? (
              <Check />
            ) : (
              !hasEnabledFilters && <ArchiveIcon />
            )}
          </ListItemIcon>
          <ListItemText>Filter archived videos</ListItemText>
        </MenuItem>
      </StyledMenu>
    </>
  );
}

export default WatchLaterViewFilters;
