import React from 'react';
import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Background, Main } from './components';
import { Provider } from 'jotai';

const App: React.FC = () => {
  return (
    <Provider>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/background" component={Background} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
