import React from 'react';
import { Box } from '@mui/material';
import MuiTab, { TabProps as MuiTabProps } from '@mui/material/Tab';
import Badge from './Badge';
import { HomeView } from 'types';
import { useAppSelector } from 'store';
import { useChannelVideos } from 'providers';
import {
  selectBookmarkedVideosCount,
  selectWatchLaterVideosCount,
} from 'store/selectors/videos';

interface TabProps extends MuiTabProps {
  value: HomeView;
  selected?: boolean;
}

export default function Tab(props: TabProps) {
  const { label, value: view, selected, ...rest } = props;
  const { videosCount } = useChannelVideos(view);
  const watchLaterVideosCount = useAppSelector(selectWatchLaterVideosCount);
  const bookmarkedVideosCount = useAppSelector(selectBookmarkedVideosCount);
  const badgeContent: string | number = (() => {
    switch (view) {
      case HomeView.Recent:
        return videosCount.displayed;
      case HomeView.WatchLater:
        return watchLaterVideosCount;
      case HomeView.Bookmarks:
        return bookmarkedVideosCount;
      default:
        return '';
    }
  })();

  return (
    <MuiTab
      sx={{
        fontSize: '0.975rem',
        fontWeight: 400,
        minWidth: 140,
        textTransform: 'capitalize',
      }}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {label}
          {selected && badgeContent ? (
            <Badge
              badgeContent={badgeContent}
              title={
                ['number', 'string'].includes(typeof badgeContent)
                  ? `${badgeContent}`
                  : ''
              }
            />
          ) : null}
        </Box>
      }
      value={view}
      disableRipple
      {...rest}
    />
  );
}
