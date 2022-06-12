import { Either } from './common';

export interface Settings {
  defaultView: HomeView | null;
  apiKey: string;
  darkMode: boolean;
  autoPlayVideos: boolean;
  recentVideosSeniority: VideosSeniority;
  recentViewFilters: RecentViewFilters;
  watchLaterViewFilters: WatchLaterViewFilters;
  homeDisplayOptions: HomeDisplayOptions;
  enableNotifications: boolean;
}

export interface HomeDisplayOptions {
  hiddenViews: HomeView[];
}

export interface RecentViewFilters {
  uncategorised: boolean;
  viewed: boolean;
  watchLater: boolean;
}

export interface WatchLaterViewFilters {
  uncategorised: boolean;
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
  TwoWeeks = 14,
  OneMonth = 31,
}

export enum SettingType {
  String,
  Secret,
  Number,
  Boolean,
  List,
  Custom,
}
