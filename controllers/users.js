const User = require('../models/user');

const renderSignUpForm = (req, res) => {
    res.render('users/signup.ejs');
}

const signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash('success', 'You have been successfully registered!');
            res.redirect('/listings');
        });

    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        req.flash('error', error);
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
        console.log("logged out successfully");
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