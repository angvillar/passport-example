import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import Settings from './Settings';
import Profile from './Profile';
import DashboardContainer from './DashboardContainer';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const isLoggedIn = (nextState, replace, callback) => {
  console.log(nextState);
  fetch('/api/user_data', {
    method: 'get',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
    },
  })
  .then((res) => {
    console.log(res);
    return res.json();
  })
  .then((json) => {
    console.log(json);
    if (!json.userId) {
      replace('/sign-in');
    }
    callback();
  })
  .catch((err) => {
    console.log(err);
    callback(err);
  });
};

const App = () => (
  <MuiThemeProvider>
    <Router history={hashHistory}>
      <Route path="/" component={SignUpForm} />
      <Route path="/sign-up" component={SignUpForm} />
      <Route path="/sign-in" component={SignInForm} />
      <Route path="/settings" component={Settings} />
      <Route path="/settings/profile" component={Profile} onEnter={isLoggedIn} />
      <Route path="/:username" component={DashboardContainer} />
    </Router>
  </MuiThemeProvider>
);

App.propTypes = {};

ReactDOM.render(<App />, document.querySelector('.app'));
