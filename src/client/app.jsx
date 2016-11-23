import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import Profile from './Profile';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <Router history={hashHistory}>
      <Route path="/" component={SignUpForm} />
      <Route path="/sign-up" component={SignUpForm} />
      <Route path="/sign-in" component={SignInForm} />
      <Route path="/profile" component={Profile} />
    </Router>
  </MuiThemeProvider>
);

App.propTypes = {};

ReactDOM.render(<App />, document.querySelector('.app'));
