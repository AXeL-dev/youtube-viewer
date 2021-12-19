import React from 'react';
import { Fade, IconButton, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import { selectSettings } from 'store/selectors/settings';
import { setRecentVideosDisplayOptions } from 'store/reducers/settings';
import { selectActiveChannels } from 'store/selectors/channels';

interface RecentViewActionsProps {}

function RecentViewActions(props: RecentViewActionsProps) {
  const channels = useAppSelector(selectActiveChannels);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const { hideViewedVideos, hideWatchLaterVideos } =
    settings.recentVideosDisplayOptions;

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
      <Fade in={channels.length > 0}>
        <Tooltip title="Filter viewed videos" placement="left" arrow>
          <IconButton
            sx={hideViewedVideos ? { bgcolor: 'action.selected' } : {}}
            aria-label="filter-viewed"
            onClick={handleFilterViewedToggle}
          >
            <VisibilityOffIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
        </Tooltip>
      </Fade>
      <Fade in={channels.length > 0}>
        <Tooltip title="Filter watch later videos" placement="left" arrow>
          <IconButton
            sx={hideWatchLaterVideos ? { bgcolor: 'action.selected' } : {}}
            aria-label="filter-watch-later"
            onClick={handleFilterWatchLaterToggle}
          >
            <TimerOffIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
        </Tooltip>
      </Fade>
    </>
  );
}

export default RecentViewActions;
