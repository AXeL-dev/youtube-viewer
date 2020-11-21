import React from 'react';
import Popup from './Popup';
import { getFromStorage, saveToStorage } from '../helpers/storage';
import { Channel, ChannelSelection } from '../models/Channel';
import { Settings } from '../models/Settings';
import { isWebExtension, setBadgeText } from '../helpers/browser';
import { debug } from '../helpers/debug';
import { Video } from '../models/Video';

interface MainProps {}

interface MainState {
  channels: Channel[];
  settings: Settings;
  cache: any;
  isReady: boolean;
}

class Main extends React.Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props);
    this.state = {
      channels: [],
      settings: {
        defaultChannelSelection: ChannelSelection.All,
        videosPerChannel: 9,
        videosAnteriority: 30, // days
        sortVideosBy: 'date',
        autoVideosCheckRate: 30, // minutes
        enableRecentVideosNotifications: true,
        autoPlayVideos: false,
        openVideosInInactiveTabs: false,
        openChannelsOnNameClick: false,
        hideEmptyChannels: false,
        autoClearRecentVideos: true,
        autoClearCache: false
      },
      cache: {},
      isReady: false
    };
    this.updateState();
    if (isWebExtension()) {
      setBadgeText(''); // reset webextension badge
    }
  }

  async updateState() {
    // get data from storage
    let [channels, settings, cache] = await getFromStorage('channels', 'settings', 'cache');
    debug('Storage data:', {channels: channels, settings: settings, cache: cache});
    // set/merge settings
    settings = settings ? {...this.state.settings, ...settings} : this.state.settings;
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
    this.setState({
      channels: channels?.length ? channels : [],
      settings: settings,
      cache: !settings?.autoClearCache && cache ? cache : {},
      isReady: true
    });
  }

  render() {
    return (
      <Popup channels={this.state.channels} settings={this.state.settings} cache={this.state.cache} isReady={this.state.isReady} />
    );
  }
}

export default Main;