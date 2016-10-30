var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
//local files
var API_KEY = require('../config.js').API_KEY;
var userPrefController = require('../../db/controllers/userPrefsCtrl.js');

var router = express.Router();

//Getting user from database for front end
router.route('/:username')
.get(function(req, res) {
  //username from request parameters
  var username = req.params.username;
  //searh db for username prefs by username
  userPrefController.findOne(username, function(err, data) {
    if(err) {
      console.error(err);
    } else {
      res.status(200).send(data);
    }
  })
});

//Updating a user's preferences for custom news 1 and 2
router.route('/:username')
.put(function(req, res) {
  //searh db for username prefs by username
  userPrefController.updateOne(req.params.username, req.body.field, req.body.value, function(err, data) {
    if(err) {
      console.error(err);
    } else {
      res.status(201).send();
    }
  })
});

//Creating a new user, sign up, test url would be api/user/login
router.route('/')
//redirect
.post(function(req, res) {
  //must have password confirm and confirm must match password
  console.log('request ----------', req.body);
  // console.log('res ----------', res);

  if (req.body.username && req.body.password) {
    console.log('inside the if statement')
    userPrefController.insertOne({username: req.body.username, password: req.body.password}, function(err, data) {
      if(err) {
        console.error(err);
      } else {
        res.status(201).send();
      }
    });
  } else {
    res.status(401).send();
  }
});

//no controller because no db
//Creating a new user, sign up, test url would be api/user/signup
router.route('/signup')
//we fire Get request to bing every time
.post(function(req, res) {
  console.log('signup request', req.body);
  var user = {};
  user.username = req.body.username;
  user.password = req.body.password;
  userPrefController.signup(req, res, function(err, data) {
    if(err) {
      console.error(err)
    }
    console.log('data', data)
    res.send(data);
  })
});


router.route('/signin')
//Creating a new user, sign up, test url would be api/user/signin
.post(function(req, res) {
  console.log('signin route');
  var user= {};
  console.log(req.body)
  user.username = req.body.username;
  user.password = req.body.password;  
  userPrefController.signin(req, res, function(err, data) {
    if(err) {
      console.error(err)
    }
    console.log('data', data);
    res.send(data);
    //?send token?
  });
});

module.exports = router;
