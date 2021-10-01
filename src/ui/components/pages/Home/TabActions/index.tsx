import React from 'react';
import { HomeView } from 'types';
import WatchLaterViewActions from './WatchLaterViewActions';
import RecentViewActions from './RecentViewActions';

interface TabActionsProps {
  tab: HomeView;
  recentVideosCount: number;
}

function TabActions(props: TabActionsProps) {
  const { tab, recentVideosCount } = props;

  return tab === HomeView.Recent ? (
    recentVideosCount > 0 ? (
      <RecentViewActions />
    ) : null
  ) : tab === HomeView.WatchLater ? (
    <WatchLaterViewActions />
  ) : null;
}

export default React.memo(TabActions);
