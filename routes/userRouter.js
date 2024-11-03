const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');

const { signup, renderSignUpForm, login, logout } = require('../controllers/users');

router.get('/signup', renderSignUpForm);

router.post('/signup', wrapAsync(signup));

router.get('/login', renderLoginForm);

router.post('/login', saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), login);

router.get('/logout', logout);


module.exports = router;