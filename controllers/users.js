const User = require('../models/user');

const renderSignUpForm = (req, res) => {
    res.render('users/signup.ejs');
}

const signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'You have been successfully registered!');
            res.redirect('/listings');
        });

    } catch (error) {
        
        if (error.name === 'UserExistsError') {
            req.flash('error', 'A user with that username already exists.');
        } else {
            req.flash('error', 'Registration failed. Please try again.');
            console.error('Signup error:', error.message);
        }
        res.redirect('/signup');
    }
}

const renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

const login = async (req, res) => {
    req.flash("success", "Logged in successfully");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully');
        res.redirect('/listings');
    });
}

module.exports = {
    renderSignUpForm,
    signup,
    renderLoginForm,
    login,
    logout,
}