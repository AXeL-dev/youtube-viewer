export interface Settings {
  defaultView: HomeView;
  apiKey: string;
  darkMode: boolean;
  autoPlayVideos: boolean;
  recentVideosSeniority: VideosSeniority;
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

export enum SettingType {
  String,
  Number,
  Boolean,
  List,
}
