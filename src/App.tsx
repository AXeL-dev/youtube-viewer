import React from 'react';
import './App.css';
import Popup from './components/Popup';
import { getFromStorage } from './helpers/storage';
import { Channel } from './models/Channel';
import { Settings } from './models/Settings';

interface AppProps {
}

interface AppState {
  channels: Channel[];
  settings: Settings;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      channels: [],
      settings: {
        videosPerChannel: 9,
        videosAnteriority: 30
      }
    };
    this.getDataFromStorage();
  }

  async getDataFromStorage() {
    const [channels, settings] = await getFromStorage('channels', 'settings');
    //console.log({channels: channels, settings: settings});
    this.setState({
      channels: channels?.length ? channels : this.state.channels,
      settings: settings ? settings : this.state.settings
    });
  }

  render() {
    return (
      <Popup channels={this.state.channels} settings={this.state.settings} />
    );
  }
}

export default App;
