import { Either } from './common';

export interface Settings {
  defaultView: HomeView | null;
  apiKey: string;
  darkMode: boolean;
  autoPlayVideos: boolean;
  recentVideosSeniority: VideosSeniority;
  recentViewFilters: RecentViewFilters;
  watchLaterViewFilters: WatchLaterViewFilters;
  allViewSorting: ViewSorting;
  recentViewSorting: ViewSorting;
  watchLaterViewSorting: ViewSorting;
  homeDisplayOptions: HomeDisplayOptions;
  enableNotifications: boolean;
  queryTimeout: number;
}

export interface HomeDisplayOptions {
  hiddenViews: HomeView[];
}

export interface ViewSorting {
  publishDate: boolean;
}

export interface RecentViewFilters {
  seen: boolean;
  watchLater: boolean;
  ignored: boolean;
  others: boolean;
}

export interface WatchLaterViewFilters {
  seen: boolean;
  archived: boolean;
  others: boolean;
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
  TwoWeeks = 14,
  OneMonth = 31,
}

export enum QueryTimeout {
  TenSeconds = 10000,
  FifteenSeconds = 15000,
  TwentySeconds = 20000,
  ThirtySeconds = 30000,
  OneMinute = 60000,
}

export enum SettingType {
  String,
  Secret,
  Number,
  Boolean,
  List,
  Custom,
}
