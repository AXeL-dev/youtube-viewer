import React from 'react';
import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Background, Viewer } from './components';
import { Provider } from 'react-redux';
import store from './store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Viewer} />
          <Route path="/background" component={Background} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
