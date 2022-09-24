import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Home, Channels, Settings, About } from 'ui/components/pages';
import { Background } from 'ui/components/webext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useTheme from 'ui/theme';
import { useAppSelector } from 'store';
import { selectMode } from 'store/selectors/settings';
import { ChannelVideosProvider } from 'providers';

function App() {
  const mode = useAppSelector(selectMode);
  const theme = useTheme(mode);

  return (
    <ChannelVideosProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/channels" component={Channels} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/about" component={About} />
            <Route path="/background" component={Background} />
            <Redirect to="/" />
          </Switch>
        </Router>
      </ThemeProvider>
    </ChannelVideosProvider>
  );
}

export default App;
