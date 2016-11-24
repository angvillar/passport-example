import mongoose from 'mongoose';
import uuid from 'uuid';
import Users from '../users/users';

// define the schema for our user model
const emailVerificationTokenSchema = mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

  token: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: '1h',
  },

});


function createEmailVerificationToken(done) {
  const emailVerificationToken = this;
  const token = uuid.v4();
  emailVerificationToken.set('token', token);
  emailVerificationToken.save((err) => {
    if (err) {
      return done(err);
    }
    console.log('email verification token saved: ', token);
    return done(null, token);
  });
}

emailVerificationTokenSchema
  .methods
  .generateToken = createEmailVerificationToken;

/* eslint-disable no-shadow */
emailVerificationTokenSchema.statics.verifyUser = function verifyUser(token, done) {
  this.findOne({ token }, (err, doc) => { // eslint-disable-line consistent-return
    if (err) {
      return done(err);
    }
    Users.findOne({ _id: doc.userId }, (err, user) => { // eslint-disable-line consistent-return
      if (err) {
        return done(err);
      }
      user.emailVerified = true; // eslint-disable-line no-param-reassign
      user.save((err) => {
        console.log('email verification token verified');
        return done(err);
      });
    });
  });
};

// create the model for users and expose it to our app
const emailVerificationTokenModel = mongoose.model('EmailVerificationToken', emailVerificationTokenSchema);
export default emailVerificationTokenModel;
