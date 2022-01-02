export interface Settings {
  defaultView: HomeView;
  apiKey: string;
  darkMode: boolean;
  autoPlayVideos: boolean;
  recentVideosSeniority: VideosSeniority;
  recentVideosDisplayOptions: VideosDisplayOptions;
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

export interface VideosDisplayOptions {
  hideViewedVideos: boolean;
  hideWatchLaterVideos: boolean;
}

export enum SettingType {
  String,
  Secret,
  Number,
  Boolean,
  List,
}
