import React from 'react';
import { HomeView } from 'types';
import WatchLaterViewActions from './WatchLaterViewActions';
import AllViewActions from './AllViewActions';
import { useAppSelector } from 'store';
import { selectChannelsCountByView } from 'store/selectors/channels';
import BookmarksViewActions from './BookmarksViewActions';

interface TabActionsProps {
  tab: HomeView;
}

function TabActions(props: TabActionsProps) {
  const { tab } = props;
  const channelsCount = useAppSelector(selectChannelsCountByView(tab));

  if (channelsCount === 0) {
    return null;
  }

  switch (tab) {
    case HomeView.All:
      return <AllViewActions />;
    case HomeView.WatchLater:
      return <WatchLaterViewActions />;
    case HomeView.Bookmarks:
      return <BookmarksViewActions />;
    default:
      return null;
  }
}

export default React.memo(TabActions);
