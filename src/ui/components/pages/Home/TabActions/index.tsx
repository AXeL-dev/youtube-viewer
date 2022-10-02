import React from 'react';
import { HomeView } from 'types';
import WatchLaterViewActions from './WatchLaterViewActions';
import RecentViewActions from './RecentViewActions';
import AllViewActions from './AllViewActions';
import { useAppSelector } from 'store';
import { selectActiveChannelsCount } from 'store/selectors/channels';
import BookmarksViewActions from './BookmarksViewActions';

interface TabActionsProps {
  tab: HomeView | null;
}

function TabActions(props: TabActionsProps) {
  const { tab } = props;
  const channelsCount = useAppSelector(selectActiveChannelsCount);

  if (channelsCount === 0) {
    return null;
  }

  switch (tab) {
    case HomeView.All:
      return <AllViewActions />;
    case HomeView.Recent:
      return <RecentViewActions />;
    case HomeView.WatchLater:
      return <WatchLaterViewActions />;
    case HomeView.Bookmarks:
      return <BookmarksViewActions />;
    default:
      return null;
  }
}

export default React.memo(TabActions);
