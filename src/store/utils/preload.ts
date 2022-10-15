import storage from 'helpers/storage';
import { defaultSettings, setSettings } from '../reducers/settings';
import { setChannels } from '../reducers/channels';
import { setVideos } from '../reducers/videos';
import { setApp } from '../reducers/app';
import { dispatch, storageKey } from './persist';
import { elapsedDays } from 'helpers/utils';
import { config as channelCheckerConfig } from 'ui/components/webext/Background/ChannelChecker';
import {
  VideoCache,
  Settings,
  VideosSeniority,
  HomeView,
  LegacySettings,
  LegacyVideoFlags,
} from 'types';
import { log } from 'helpers/logger';

export const preloadState = async () => {
  const state = await storage.get(storageKey);
  let shouldPersist = !state;
  if (state) {
    // Load stored data
    const { settings, channels, videos } = state;
    const newSettings = replaceLegacySettings(settings);
    if (settings) {
      dispatch(setSettings(newSettings));
    }
    if (channels) {
      dispatch(setChannels(channels));
    }
    if (videos) {
      dispatch(
        setVideos({
          list: removeOutdatedVideos(
            replaceViewedFlagWithSeen(videos.list),
            newSettings,
          ),
        }),
      );
    }
  }
  dispatch(setApp({ loaded: true }), shouldPersist);
};

const replaceLegacySettings = (
  settings: LegacySettings | Settings | undefined,
): Settings => {
  if (!settings) {
    return defaultSettings;
  }
  if ('viewOptions' in settings) {
    return settings;
  }
  const {
    recentVideosSeniority,
    recentViewFilters,
    watchLaterViewFilters,
    bookmarksViewFilters,
    allViewSorting,
    recentViewSorting,
    watchLaterViewSorting,
    bookmarksViewSorting,
    defaultView,
    homeDisplayOptions,
    recentVideosDisplayOptions,
    ...rest
  } = settings as LegacySettings;
  return {
    ...rest,
    viewOptions: {
      [HomeView.All]: {
        sorting: recentViewSorting,
        filters: recentViewFilters,
        videosSeniority: recentVideosSeniority,
      },
      [HomeView.WatchLater]: {
        sorting: watchLaterViewSorting,
        filters: watchLaterViewFilters,
        videosSeniority: VideosSeniority.Any,
      },
      [HomeView.Bookmarks]: {
        sorting: bookmarksViewSorting,
        filters: bookmarksViewFilters,
        videosSeniority: VideosSeniority.Any,
      },
    },
    defaultView:
      (defaultView as string) === 'recent' ? HomeView.All : defaultView,
    homeDisplayOptions: {
      ...homeDisplayOptions,
      hiddenViews: homeDisplayOptions.hiddenViews.filter(
        (view) => !['all', 'recent'].includes(view),
      ),
    },
  };
};

const replaceViewedFlagWithSeen = (videos: VideoCache[]) => {
  return videos.map((video) => {
    const { viewed, ...flags } = (video.flags as LegacyVideoFlags) || {};
    return {
      ...video,
      flags: viewed
        ? {
            ...flags,
            seen: viewed,
          }
        : flags,
    };
  });
};

const removeOutdatedVideos = (videos: VideoCache[], settings: Settings) => {
  log('Removing outdated videos.');
  return videos.filter(
    ({ flags, publishedAt }) =>
      flags.toWatchLater ||
      flags.bookmarked ||
      ((flags.seen || flags.ignored) &&
        elapsedDays(publishedAt) <= VideosSeniority.OneMonth) ||
      (flags.recent &&
        elapsedDays(publishedAt) <=
          settings.viewOptions[HomeView.All].videosSeniority) ||
      (flags.notified &&
        elapsedDays(publishedAt) <= channelCheckerConfig.videosSeniority),
  );
};
