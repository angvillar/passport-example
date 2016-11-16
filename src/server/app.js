import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import flash from 'connect-flash';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import mongodbConfig from './mongodb-config';

mongoose.connect(mongodbConfig.url);

const app = express();
// log every request to the console
app.use(morgan('dev'));
// read cookies (needed for auth)
app.use(cookieParser());
// get information from html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// set up ejs for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../src/client'));
// set up session
app.use(session({
  secret: 'secretKey',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// use connect-flash for flash messages stored in session
app.use(flash());

// load the index.ejs file
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// show the login form
app.get('/login', (req, res) => {
  // render the page and pass in any flash data if it exists
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

// show the signup form
app.get('/signup', (req, res) => {
  // render the page and pass in any flash data if it exists
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
/*
app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile.ejs', {
    // get the user out of session and pass to template
    user: req.user,
  });
});
*/

// logout
/*
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
*/

// route middleware to make sure a user is logged in
/*
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  res.redirect('/');
}
*/

app.listen(3000, () => {
  console.log('listening on *:3000'); // eslint-disable-line no-console
});
