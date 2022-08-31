import storage from 'helpers/storage';
import { setSettings } from '../reducers/settings';
import { setChannels } from '../reducers/channels';
import { setVideos } from '../reducers/videos';
import { setApp } from '../reducers/app';
import { dispatch, storageKey } from './persist';
import { elapsedDays } from 'helpers/utils';
import { config as channelCheckerConfig } from 'ui/components/webext/Background/ChannelChecker';
import { VideoCache, Settings } from 'types';
import { log } from 'helpers/logger';

export const preloadState = async () => {
  const state = await storage.get(storageKey);
  let shouldPersist = !state;
  if (state) {
    // Load stored data
    const { settings, channels, videos } = state;
    if (settings) {
      dispatch(setSettings(settings));
    }
    if (channels) {
      dispatch(setChannels(channels));
    }
    if (videos) {
      dispatch(
        setVideos({
          list: removeOutdatedVideos(
            replaceViewedFlagWithSeen(videos.list),
            settings,
          ),
        }),
      );
    }
  }
  dispatch(setApp({ loaded: true }), shouldPersist);
};

const replaceViewedFlagWithSeen = (videos: VideoCache[]) => {
  return videos.map((video) => {
    const { viewed, ...flags } =
      (video.flags as typeof video.flags & { viewed: boolean }) || {};
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
      flags.seen ||
      flags.toWatchLater ||
      ((flags.recent || flags.ignored) &&
        elapsedDays(publishedAt) <= settings.recentVideosSeniority) ||
      (flags.notified &&
        elapsedDays(publishedAt) <= channelCheckerConfig.videosSeniority),
  );
};
