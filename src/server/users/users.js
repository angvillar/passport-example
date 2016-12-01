import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// define the schema for our user model
const usersSchema = mongoose.Schema({

  username: String,

  password: String,

  local: {
    email: String,
    password: String,
  },

  profile: {
    name: String,
    bio: String,
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

});

// generating a hash
usersSchema.methods.generateHash = password => bcrypt
  .hashSync(password, bcrypt.genSaltSync(8), null);

// checking if password is valid
usersSchema.methods.validPassword = function usersValidatePassword(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
const userModel = mongoose.model('User', usersSchema);
export default userModel;
