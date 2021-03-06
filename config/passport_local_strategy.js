const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

// include the User Model
const User = require('../models/user');

//-------------------Authentication Using Passport.js ----------------------------------------- //
// here this usernameField is the 'name' attribute of input at sign-in page
// -----------------------------------------------------passReqToCallback is used to pass req arguement in callback fn ----------- //
passport.use(new LocalStrategy({usernameField : 'email', passReqToCallback : true}, function(req, email, password, done) {


    // now inside this function we have to find the user of email as in argument
    // to authenticate
    User.findOne({email : email}, function(err, user) {

        if(err) { console.log("Error finding user ! --- > Passport.js"); return done(err); }

        // if there is no error bu user is not found
        // or if user is found but passowrd is wrong
        if(!user || user.password != password){
            
            console.log("Invalid username/passsword");
            // req.flash('error', 'Invalid Username/Password');
            return done(null, false);
        }

        else if(req.params.userType != user.userType){

            console.log("Invalid User");
            // req.flash('error', 'Invalid Username/Password');
            return done(null, false);            
        }

        // if user is found then
        // null indicates no ERROR
        return done(null, user);

    });

}));

// now like in mannual authentication we were sending user_id to cookie
// that means we were telling that user_id is the only key which needs to be encrypted

// thats serializing
passport.serializeUser(function(user, done){
    done(null, user._id);
});


// opposite is deserializing the user from key(user id) in the cookie to establish identity
passport.deserializeUser(function(id, done){

    User.findById(id, function(err, user){

        return done(err, user);

    });
});

// lets just check if user is Authenticated (it's a middleware function)
passport.checkAuthentication = function(req, res, next) {

    // all we have to do is to check || isAuthenticated() is function epxress-session gives to req
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('back');

}

// set the authentication of user
passport.setAuthenticatedUser = function(req, res, next) {

    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }

    next();
}


module.exports = passport;