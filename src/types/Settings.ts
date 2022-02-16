import { Either } from './common';

export interface Settings {
  defaultView: HomeView;
  apiKey: string;
  darkMode: boolean;
  autoPlayVideos: boolean;
  recentVideosSeniority: VideosSeniority;
  recentViewFilters: RecentViewFilters;
  watchLaterViewFilters: WatchLaterViewFilters;
  enableNotifications: boolean;
}

export interface RecentViewFilters {
  any: boolean;
  viewed: boolean;
  watchLater: boolean;
}

export interface WatchLaterViewFilters {
  any: boolean;
  viewed: boolean;
  archived: boolean;
}

export type ViewFilters = Either<RecentViewFilters, WatchLaterViewFilters>;

export type ViewFilter = keyof ViewFilters;

export enum HomeView {
  All = 'all',
  Recent = 'recent',
  WatchLater = 'watch-later',
}

export enum VideosSeniority {
  OneDay = 1,
  ThreeDays = 3,
  SevenDays = 7,
}

export enum SettingType {
  String,
  Secret,
  Number,
  Boolean,
  List,
  Custom,
}
