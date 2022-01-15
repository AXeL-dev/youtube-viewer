import React from 'react';
import { HomeView } from 'types';
import WatchLaterViewActions from './WatchLaterViewActions';
import RecentViewActions from './RecentViewActions';
import { useAppSelector } from 'store';
import { selectActiveChannelsCount } from 'store/selectors/channels';

interface TabActionsProps {
  tab: HomeView;
  recentVideosCount: number;
  watchLaterVideosCount: number;
}

function TabActions(props: TabActionsProps) {
  const { tab, recentVideosCount, watchLaterVideosCount } = props;
  const channelsCount = useAppSelector(selectActiveChannelsCount);

  switch (tab) {
    case HomeView.Recent:
      return channelsCount > 0 && recentVideosCount > 0 ? (
        <RecentViewActions />
      ) : null;
    case HomeView.WatchLater:
      return channelsCount > 0 && watchLaterVideosCount > 0 ? (
        <WatchLaterViewActions />
      ) : null;
    default:
      return null;
  }
}

export default React.memo(TabActions);
