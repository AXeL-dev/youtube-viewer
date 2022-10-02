import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  HomeDisplayOptions,
  HomeView,
  Settings,
  VideosSeniority,
  ViewFilters,
  ViewSorting,
} from 'types';

const { REACT_APP_YOUTUBE_API_KEY } = process.env;

export const defaultSettings = {
  defaultView: HomeView.All,
  apiKey: REACT_APP_YOUTUBE_API_KEY || '',
  darkMode: false,
  autoPlayVideos: true,
  recentVideosSeniority: VideosSeniority.OneDay,
  recentViewFilters: {
    seen: true,
    watchLater: true,
    bookmarked: true,
    ignored: false,
    others: true,
  },
  watchLaterViewFilters: {
    seen: true,
    bookmarked: true,
    archived: true,
    others: true,
  },
  bookmarksViewFilters: {
    seen: true,
    watchLater: true,
    others: true,
  },
  allViewSorting: {
    publishDate: false,
  },
  recentViewSorting: {
    publishDate: true,
  },
  watchLaterViewSorting: {
    publishDate: false,
  },
  bookmarksViewSorting: {
    publishDate: false,
  },
  homeDisplayOptions: {
    hiddenViews: [HomeView.Bookmarks],
    extraVideoActions: [],
  },
  enableNotifications: true,
  queryTimeout: 10000,
};

const views = Object.values(HomeView);

interface SettingsState extends Settings {}

const initialState: SettingsState = {
  ...defaultSettings,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetSettings: (state) => {
      return {
        ...state,
        ...defaultSettings,
      };
    },
    setViewFilters: (
      state,
      action: PayloadAction<{
        view: HomeView;
        filters: Partial<ViewFilters>;
      }>,
    ) => {
      const { view, filters } = action.payload;
      switch (view) {
        case HomeView.Recent:
          return {
            ...state,
            recentViewFilters: {
              ...state.recentViewFilters,
              ...filters,
            },
          };
        case HomeView.WatchLater:
          return {
            ...state,
            watchLaterViewFilters: {
              ...state.watchLaterViewFilters,
              ...filters,
            },
          };
        case HomeView.Bookmarks:
          return {
            ...state,
            bookmarksViewFilters: {
              ...state.bookmarksViewFilters,
              ...filters,
            },
          };
        default:
          return state;
      }
    },
    setViewSorting: (
      state,
      action: PayloadAction<{
        view: HomeView;
        sorting: Partial<ViewSorting>;
      }>,
    ) => {
      const { view, sorting } = action.payload;
      switch (view) {
        case HomeView.All:
          return {
            ...state,
            allViewSorting: {
              ...state.allViewSorting,
              ...sorting,
            },
          };
        case HomeView.Recent:
          return {
            ...state,
            recentViewSorting: {
              ...state.recentViewSorting,
              ...sorting,
            },
          };
        case HomeView.WatchLater:
          return {
            ...state,
            watchLaterViewSorting: {
              ...state.watchLaterViewSorting,
              ...sorting,
            },
          };
        case HomeView.Bookmarks:
          return {
            ...state,
            bookmarksViewSorting: {
              ...state.bookmarksViewSorting,
              ...sorting,
            },
          };
        default:
          return state;
      }
    },
    setHomeDisplayOptions: (
      state,
      action: PayloadAction<Partial<HomeDisplayOptions>>,
    ) => {
      const { hiddenViews } = action.payload;
      return {
        ...state,
        defaultView:
          !state.defaultView || hiddenViews?.includes(state.defaultView)
            ? views.find((view) => !hiddenViews?.includes(view)) || null
            : state.defaultView,
        homeDisplayOptions: {
          ...state.homeDisplayOptions,
          ...action.payload,
        },
      };
    },
  },
});

export const {
  setSettings,
  resetSettings,
  setViewFilters,
  setViewSorting,
  setHomeDisplayOptions,
} = settingsSlice.actions;

export default settingsSlice.reducer;
