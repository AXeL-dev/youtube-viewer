import {
  AllViewFilters as RecentViewFilters,
  BookmarksViewFilters,
  Settings,
  VideosSeniority,
  ViewSorting,
  WatchLaterViewFilters,
} from './Settings';
import { VideoFlags } from './Video';

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

export type LegacyVideoFlags = VideoFlags & {
  viewed: boolean;
};
