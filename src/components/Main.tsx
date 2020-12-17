import React from 'react';
import Popup from './popup/Popup';
import { getFromStorage, saveToStorage } from '../helpers/storage';
import { isWebExtension, setBadgeText } from '../helpers/browser';
import { debug } from '../helpers/debug';
import { Video } from '../models/Video';
import { useConstructor } from '../hooks/useConstructor';
import { useAtom } from 'jotai';
import { channelsAtom } from '../atoms/channels';
import { settingsAtom } from '../atoms/settings';
import { cacheAtom } from '../atoms/cache';

export default function Main() {
  useConstructor(() => {
    fetchData();
    if (isWebExtension()) {
      setBadgeText(''); // reset webextension badge
    }
  });

  const [channels, setChannels] = useAtom(channelsAtom);
  const [settings, setSettings] = useAtom(settingsAtom);
  const [cache, setCache] = useAtom(cacheAtom);
  const [isReady, setIsReady] = React.useState(false);

  async function fetchData() {
    // get data from storage
    const storage = await getFromStorage('channels', 'settings', 'cache');
    const data = {
      channels: storage[0],
      settings: storage[1],
      cache: storage[2]
    };
    debug('Storage data:', {
      channels: data.channels,
      settings: data.settings,
      cache: data.cache
    });
    // set/merge settings
    data.settings = data.settings ? {settings, ...data.settings} : settings;
    // clear recent videos
    if (data.settings?.autoClearRecentVideos && data.cache) {
      let cacheHasChanged: boolean = false;
      Object.keys(data.cache).forEach((channelId: string) => {
        data.cache[channelId] = data.cache[channelId].map((video: Video) => {
          if (video.isRecent) {
            video.isRecent = false;
            cacheHasChanged = true;
          }
          return video;
        });
      });
      // update cache
      if (cacheHasChanged) {
        saveToStorage({ cache: data.cache });
      }
    }
    // update state
    setChannels(data.channels?.length ? data.channels : []);
    setSettings(data.settings);
    setCache(!data.settings?.autoClearCache && data.cache ? data.cache : {});
    setIsReady(true);
  }

  return (
    <Popup isReady={isReady} />
  );
}
