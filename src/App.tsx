import React from 'react';
import './App.css';
import Popup from './components/Popup';
import { getFromStorage } from './helpers/storage';
import { Channel, ChannelSelection } from './models/Channel';
import { Settings } from './models/Settings';

interface AppProps {
}

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
        autoPlayVideos: false,
        openVideosInInactiveTabs: false,
        openChannelsOnNameClick: false,
        autoClearCache: false
      },
      cache: {},
      isReady: false
    };
    this.getDataFromStorage();
  }

  async getDataFromStorage() {
    const [channels, settings, cache] = await getFromStorage('channels', 'settings', 'cache');
    //console.log({channels: channels, settings: settings, cache: cache});
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
