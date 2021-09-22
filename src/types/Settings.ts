export interface Settings {
  defaultView: HomeView;
  apiKey: string;
  darkMode: boolean;
  autoPlayVideos: boolean;
}

export enum HomeView {
  All = 'all',
  Recent = 'recent',
  WatchLater = 'watch-later',
}

export enum SettingType {
  String,
  Number,
  Boolean,
  List,
}
