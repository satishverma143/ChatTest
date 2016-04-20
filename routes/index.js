var passport = require('passport');
var express = require('express');
var utility = require('../config/utility.js');
var router = express.Router();

module.exports = function (app) {
    
    /**
   * Display Home Page
  **/
  app.get('/', function (req, res) {
        var user = req.user;
        if (typeof user === "undefined") {
            res.render('index', {
                title: 'Chat Application',
                message: 'Your header message',
                userName: (req.user) ? req.user.username : undefined,
                flashMessage: req.flash('flashMessage')
            });
        }
        else {
            res.redirect('/chat');
            
        }
    });
    
    /**
   * Receive Signin Form Data
  **/
  app.post('/signin', passport.authenticate('local-login', { failureRedirect: '/' }),
    function (req, res) {
        if (req.user) {
            if (req.user.roleid == 2) {
                return res.redirect('/admin');
            }
            else if (req.user.roleid == 3) {
                return res.redirect('/support');
            }
            else if (req.user.roleid == 1) {
                return res.redirect('/chat');
            }
                
        }
        //flashMessage: req.flash('flashMessage');
        //res.redirect('/');
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
    
    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });
}