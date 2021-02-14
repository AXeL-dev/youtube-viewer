import React from 'react';
import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Background, Viewer } from './components';
import { Provider } from 'jotai';

const App: React.FC = () => {
  return (
    <Provider>
      <Router>
        <Switch>
          <Route exact path="/" component={Viewer} />
          <Route path="/background" component={Background} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
