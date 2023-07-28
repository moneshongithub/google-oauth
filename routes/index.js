var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
var session = require('express-session');
const {request}= require('http')
var User = require('./users.js')
var dotenv = require("dotenv").config()



passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'email','profile' ]
}, async function verify(issuer, profile, cb) {
 try{
  console.log(profile)
  let existingUser = await User.findOne({emails: profile.emails[0].value})
  if(existingUser){
    return cb(null,existingUser)
  }else{
    let newUser = await User.create({name:profile.displayName, emails:profile.emails[0].value})
    return cb(null,newUser)
  }

 }
 catch(err){
  console.log(err)
  return err;
 }
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/login/federated/google', passport.authenticate('google'));


router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;
