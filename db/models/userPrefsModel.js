var Q = require('q')
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALTDEPTH = 12;

//schema instantiation
var UserPrefsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String,
  customnews1: String,
  customnews2: String
});

  //bcrypt async compare


// var Promise = require('bluebird')

// function loadImageAsync(url) {
//   return new Promise(function(resolve, reject) {
//     var image = new Image();

//     image.onload = function() {
//       resolve(image);
//     };

//     image.onerror = function() {
//       reject(new Error('Could not load image at ' + url));
//     };

//     image.src = url;
//   });
// }


//pre hook
//serial middleware "pre" hook http://mongoosejs.com/docs/middleware.html
UserPrefsSchema.pre('save', function (next) {
  //saves context
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {//mongoose method
    return next();
  }
  // generate a salt
  bcrypt.genSalt(SALTDEPTH, function (err, salt) {
    if (err) {
      return next(err);
    }
    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }
      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

//comparePasswords method
UserPrefsSchema.methods.comparePasswords = function (pwSubmitted) {
  //pw from db
  var dbPassword = this.password;
  return Q.Promise( function(resolve, reject) {

    bcrypt.compare(pwSubmitted, dbPassword, function(err, isMatch) {
      if(err) {reject (err)}
        else {
          resolve(isMatch)
        }
    })
  })
}

var userPrefs = mongoose.model('UserPrefsSchema', UserPrefsSchema);
//schema to model conversion and export
module.exports = userPrefs;
