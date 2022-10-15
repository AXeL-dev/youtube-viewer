import {
  AllViewFilters as RecentViewFilters,
  BookmarksViewFilters,
  Settings,
  VideosSeniority,
  ViewSorting,
  WatchLaterViewFilters,
} from './Settings';

export interface LegacySettings extends Omit<Settings, 'viewOptions'> {
  recentVideosSeniority: VideosSeniority;
  recentViewFilters: RecentViewFilters;
  watchLaterViewFilters: WatchLaterViewFilters;
  bookmarksViewFilters: BookmarksViewFilters;
  allViewSorting: ViewSorting;
  recentViewSorting: ViewSorting;
  watchLaterViewSorting: ViewSorting;
  bookmarksViewSorting: ViewSorting;
}
