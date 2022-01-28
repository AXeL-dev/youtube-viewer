import storage from 'helpers/storage';
import { setSettings } from '../reducers/settings';
import { setChannels } from '../reducers/channels';
import { setVideos } from '../reducers/videos';
import { setApp } from '../reducers/app';
import { LegacyVideoCache } from 'types';
import { dispatch, storageKey } from './persist';

export const preloadState = async () => {
  const state = await storage.get(storageKey);
  let shouldPersist = !state;
  if (!state) {
    // Handle backward compatibility with v0.6.x
    const legacy = (await storage.get('settings', 'channels')) || {};
    if (legacy.settings) {
      const { apiKey } = legacy.settings;
      if (apiKey) {
        dispatch(setSettings({ apiKey }));
      }
    }
    if (legacy.channels) {
      dispatch(setChannels({ list: legacy.channels }));
    }
  } else {
    // Load stored data
    const { settings, channels, videos } = state || {};
    if (settings) {
      dispatch(setSettings(settings));
    }
    if (channels) {
      dispatch(setChannels(channels));
    }
    if (videos) {
      // Handle legacy videos cache
      const legacyVideos = videos.list.filter(
        (video: LegacyVideoCache) =>
          !!Object.keys(video).find((key) =>
            ['isViewed', 'isToWatchLater', 'isNotified'].includes(key)
          )
      );
      if (legacyVideos.length > 0) {
        shouldPersist = true;
        dispatch(
          setVideos({
            list: videos.list.map(
              ({
                isViewed,
                isToWatchLater,
                isNotified,
                ...video
              }: LegacyVideoCache) => ({
                ...video,
                flags: {
                  viewed: isViewed || false,
                  toWatchLater: isToWatchLater || false,
                  notified: isNotified || false,
                },
              })
            ),
          })
        );
      } else {
        dispatch(setVideos(videos));
      }
    }
  }
  dispatch(setApp({ loaded: true }), shouldPersist);
};
