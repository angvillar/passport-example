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
};

export default passportConfig;
