import React from 'react';
import Popup from './popup/Popup';
import { getFromStorage, saveToStorage } from '../helpers/storage';
import { isWebExtension, setBadgeText } from '../helpers/browser';
import { debug } from '../helpers/debug';
import { Video } from '../models/Video';
import { useConstructor } from '../hooks/useConstructor';
import { useUpdateAtom } from 'jotai/utils';
import { channelsAtom } from '../atoms/channels';
import { settingsAtom, defaultSettings } from '../atoms/settings';
import { cacheAtom } from '../atoms/cache';

export default function Main() {
  useConstructor(() => {
    fetchData();
    if (isWebExtension()) {
      setBadgeText(''); // reset webextension badge
    }
  });

  const setChannels = useUpdateAtom(channelsAtom);
  const setSettings = useUpdateAtom(settingsAtom);
  const setCache = useUpdateAtom(cacheAtom);
  const [isReady, setIsReady] = React.useState(false);

  async function fetchData() {
    // get data from storage
    let [channels, settings, cache] = await getFromStorage('channels', 'settings', 'cache');
    debug('Storage data:', {
      channels: channels,
      settings: settings,
      cache: cache
    });
    // set/merge settings
    settings = settings ? {defaultSettings, ...settings} : defaultSettings;
    // clear recent videos
    if (settings?.autoClearRecentVideos && cache) {
      let cacheHasChanged: boolean = false;
      Object.keys(cache).forEach((channelId: string) => {
        cache[channelId] = cache[channelId].map((video: Video) => {
          if (video.isRecent) {
            video.isRecent = false;
            cacheHasChanged = true;
          }
          return video;
        });
      });
      // update cache
      if (cacheHasChanged) {
        saveToStorage({ cache: cache });
      }
    }
    // update state
    setChannels(channels || []);
    setSettings(settings);
    setCache(!settings?.autoClearCache && cache ? cache : {});
    setIsReady(true);
  }

  return (
    <Popup isReady={isReady} />
  );
}
