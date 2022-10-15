export enum HomeView {
  All = 'all',
  WatchLater = 'watchLater',
  Bookmarks = 'bookmarks',
}

export interface Settings {
  defaultView: HomeView | null;
  apiKey: string;
  darkMode: boolean;
  autoPlayVideos: boolean;
  viewOptions: {
    [HomeView.All]: {
      sorting: ViewSorting;
      filters: AllViewFilters;
      videosSeniority: VideosSeniority;
    };
    [HomeView.WatchLater]: {
      sorting: ViewSorting;
      filters: WatchLaterViewFilters;
      videosSeniority: VideosSeniority;
    };
    [HomeView.Bookmarks]: {
      sorting: ViewSorting;
      filters: BookmarksViewFilters;
      videosSeniority: VideosSeniority;
    };
  };
  homeDisplayOptions: HomeDisplayOptions;
  enableNotifications: boolean;
  queryTimeout: number;
}

export enum ExtraVideoAction {
  CopyLink = 'copyLink',
}

export interface HomeDisplayOptions {
  hiddenViews: HomeView[];
  extraVideoActions: ExtraVideoAction[];
}

export interface ViewSorting {
  publishDate: boolean;
}

export interface AllViewFilters {
  seen: boolean;
  watchLater: boolean;
  bookmarked: boolean;
  ignored: boolean;
  others: boolean;
}

export interface WatchLaterViewFilters {
  seen: boolean;
  bookmarked: boolean;
  archived: boolean;
  others: boolean;
}

export interface BookmarksViewFilters {
  seen: boolean;
  watchLater: boolean;
  others: boolean;
}

export interface ViewFilters
  extends AllViewFilters,
    WatchLaterViewFilters,
    BookmarksViewFilters {}

export type ViewFilter = keyof ViewFilters;

export enum VideosSeniority {
  Any = 0,
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
