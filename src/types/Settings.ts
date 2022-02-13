export interface Settings {
  defaultView: HomeView;
  apiKey: string;
  darkMode: boolean;
  autoPlayVideos: boolean;
  recentVideosSeniority: VideosSeniority;
  recentVideosDisplayOptions: RecentVideosDisplayOptions;
  watchLaterVideosDisplayOptions: WatchLaterVideosDisplayOptions;
  enableNotifications: boolean;
}

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

export interface RecentVideosDisplayOptions {
  hideViewedVideos: boolean;
  hideWatchLaterVideos: boolean;
}

export type RecentVideoDisplayOption = keyof RecentVideosDisplayOptions;

export interface WatchLaterVideosDisplayOptions {
  hideViewedVideos: boolean;
  hideArchivedVideos: boolean;
}

export type WatchLaterVideoDisplayOption = keyof WatchLaterVideosDisplayOptions;

export enum SettingType {
  String,
  Secret,
  Number,
  Boolean,
  List,
  Custom,
}
