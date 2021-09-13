import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Main, Background } from './ui/components/pages';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useTheme from './ui/theme';

function App() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/background" component={Background} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
