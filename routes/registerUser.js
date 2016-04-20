﻿var passport = require('passport');
var express = require('express');
var router = express.Router();

module.exports = function (app) {
    
    ///* GET home page. */
    router.get('/', function (req, res) {
        res.render('index', { title: 'Chat Application' });
    });
    
    /**
   * Receive Signin Form Data
  **/
  app.post('/signin',
    passport.authenticate('local-login', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/');
    });
    
    /**
   * Display Signup Form
  **/
  app.get('/signup', function (req, res) {
        res.render('signup', {
            title: 'Your title',
            message: 'Your Message',
            userName: (req.user) ? req.user.username : undefined,
            flashMessage: req.flash('flashMessage')
        });
    });
    
    /**
   * Receive Signup Form Data
  **/
  app.post('/signup',
    passport.authenticate('local-signup', { failureRedirect: '/signup' }),
    function (req, res) {
        res.redirect('/');
    });
}
