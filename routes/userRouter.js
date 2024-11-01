const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash('success', 'You have been successfully registered!');
        res.redirect('/listings');

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect('/listings');
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) {
            next(err);
        }
        req.flash('success', 'Logged out successfully');
        res.redirect('/listings');
    });
    
});


module.exports = router;