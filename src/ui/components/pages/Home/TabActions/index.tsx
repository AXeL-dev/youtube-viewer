import React from 'react';
import { HomeView } from 'types';
import WatchLaterViewActions from './WatchLaterViewActions';
import RecentViewActions from './RecentViewActions';

interface TabActionsProps {
  tab: HomeView;
}

function TabActions(props: TabActionsProps) {
  const { tab } = props;

  return tab === HomeView.Recent ? (
    <RecentViewActions />
  ) : tab === HomeView.WatchLater ? (
    <WatchLaterViewActions />
  ) : null;
}

export default React.memo(TabActions);
