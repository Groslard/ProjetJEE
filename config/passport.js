var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');


passport.use('local', new LocalStrategy({
        usernameField: 'nom',
        passwordField: 'code'
    },
    function(nom, code, done) {
        User.findOne({ code: code }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect code.' });
            }
            return done(null, user);
        });
    }
));