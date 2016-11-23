import passportLocal from 'passport-local';
import Users from './users/users';

const LocalStrategy = passportLocal.Strategy;

const passportConfig = (passport) => {
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => done(null, user.id));

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => done(err, user));
  });

  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    // allows us to pass back the entire request to the callback
    passReqToCallback: true,
  }, (req, email, password, done) => {
    console.log('SIGNUP DATA: ', email, password);
    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(() => {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      Users.findOne({ 'local.email': email }, (err, user) => { // eslint-disable-line consistent-return
        // if there are any errors, return the error
        if (err) {
          return done(err);
        }
        // check to see if theres already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }
        // if there is no user with that email create the user
        const newUser = new Users();
        // set the user's local credentials
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);
        // save the user
        newUser.save((err) => { // eslint-disable-line no-shadow
          if (err) {
            throw err;
          }
          return done(null, newUser);
        });
      });
    });
  }));

  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    // allows us to pass back the entire request to the callback
    passReqToCallback: true,
  }, (req, email, password, done) => {
    console.log('SIGNIN DATA: ', email, password);
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    Users.findOne({ 'local.email': email }, (err, user) => {
      // if there are any errors, return the error before anything else
      if (err) {
        return done(err);
      }
      // if no user is found, return the message
      if (!user) {
        // req.flash is the way to set flashdata using connect-flash
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      // if the user is found but the password is wrong
      if (!user.validPassword(password)) {
        // create the loginMessage and save it to session as flashdata
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }
      // all is well, return successful user
      return done(null, user);
    });
  }));
};

export default passportConfig;
