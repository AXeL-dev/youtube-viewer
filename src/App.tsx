import React from 'react';
import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Background from './components/Background';
import Main from './components/Main';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/background" component={Background} />
      </Switch>
    </Router>
  );
}

export default App;
