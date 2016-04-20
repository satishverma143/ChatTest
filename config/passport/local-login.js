var connection = require('../connection.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

module.exports = function (salt) {
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, function (req, email, password, done) {
        connection.query("SELECT * FROM users WHERE is_active=1 and email = ?", [email], function (err, rows) {
            if (err)
                return done(err);
            
            if (!rows.length) {
                return done(null, false, req.flash('flashMessage', 'No user found.'));
            }
            
            if (bcrypt.hashSync(password, salt) !== rows[0].password) {
                return done(null, false, req.flash('flashMessage', 'Invalid login details or your account may not be active, please contact to administrator.'));
            }
            
            return done(null, rows[0]);
        })
    }));
}
