var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');

//Bring in user model
var User = require('../model/user');

//register form
router.get('/register', (req, res) => {
    res.render('register');
});

//register process
router.post('/register', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password2 do not match').equals(req.body.password);

    let errors = req.validationErrors();
    if(errors){
        res.render('register', {
            errors:errors
        });
    } else {
        var newUser = new User({
            name: name,
            email:email,
            username:username,
            password:password
        });
    }

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err){
                console.log(err);
            }
            newUser.password = hash;
            newUser.save(function(err){
                if(err){
                    console.log(err);
                }else {
                    req.flash('success', 'You are now registered and can log in');
                    res.redirect('/users/login');
                }
            });
        });
    });

});

//Login form
router.get('/login', (req, res) => {
    res.render('login');
});

//Login Process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: 'profile',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Get Profile
router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, function(err, foundUser) {
        if(err) {
            req.flash("error", "Something went wrong");
            res.redirect('/');
        } 
        res.render("/profile",{user: foundUser});
    });
    
});

//Posting profile
// router.post('/profile', (req, res) => {
//     var email = req.body.email;

//     req.checkBody('email', 'email is required').notEmpty();

//     let errors = req.validationErrors();
//     if(errors){
//         res.render('profile', {
//             errors:errors
//         });
//     } else {
//         var newUser = new User({
//             email:email
//         });

//         newUser.save(function(err){
//             if(err){
//                 console.log(err);
//             }else {
//                 req.flash('success', 'You are now registered and can log in');
//                 res.redirect('/users/login');
//             }
//         });
//     }
// });

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/users/login');
});

module.exports = router;