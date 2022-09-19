import React from 'react';
import { HomeView } from 'types';
import WatchLaterViewActions from './WatchLaterViewActions';
import RecentViewActions from './RecentViewActions';
import AllViewActions from './AllViewActions';
import { useAppSelector } from 'store';
import { selectActiveChannelsCount } from 'store/selectors/channels';

interface TabActionsProps {
  tab: HomeView | null;
  recentVideosCount: number;
  watchLaterVideosCount: number;
}

function TabActions(props: TabActionsProps) {
  const { tab, recentVideosCount, watchLaterVideosCount } = props;
  const channelsCount = useAppSelector(selectActiveChannelsCount);

  switch (tab) {
    case HomeView.All:
      return <AllViewActions />;
    case HomeView.Recent:
      return channelsCount > 0 ? (
        <RecentViewActions videosCount={recentVideosCount} />
      ) : null;
    case HomeView.WatchLater:
      return channelsCount > 0 ? (
        <WatchLaterViewActions videosCount={watchLaterVideosCount} />
      ) : null;
    default:
      return null;
  }
}

export default React.memo(TabActions);
