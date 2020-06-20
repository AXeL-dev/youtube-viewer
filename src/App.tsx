import React from 'react';
import './App.css';
import Popup from './components/Popup';
import { getFromStorage } from './helpers/storage';
import { Channel, ChannelSelection } from './models/Channel';
import { Settings } from './models/Settings';
import { isWebExtension, setBadgeText } from './helpers/browser';
import { debug } from './helpers/debug';

interface AppProps {}

interface AppState {
  channels: Channel[];
  settings: Settings;
  cache: any;
  isReady: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
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
        autoClearCache: false
      },
      cache: {},
      isReady: false
    };
    this.getDataFromStorage();
    if (isWebExtension()) {
      setBadgeText(''); // reset webextension badge
    }
  }

  async getDataFromStorage() {
    const [channels, settings, cache] = await getFromStorage('channels', 'settings', 'cache');
    debug('Storage data:', {channels: channels, settings: settings, cache: cache});
    this.setState({
      channels: channels?.length ? channels : this.state.channels,
      settings: settings ? {...this.state.settings, ...settings} : this.state.settings,
      cache: !settings?.autoClearCache && cache ? cache : this.state.cache,
      isReady: true
    });
  }

  render() {
    return (
      <Popup channels={this.state.channels} settings={this.state.settings} cache={this.state.cache} isReady={this.state.isReady} />
    );
  }
}

export default App;
