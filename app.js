const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const listingRouter = require('./routes/listingRouter.js');
const reviewRouter = require('./routes/reviewRouter.js');
const userRouter = require('./routes/userRouter');

app.set("view engine", "ejs");      // rendering views
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));        // parsing the URL-encoded data and making it available in req.body
app.use(methodOverride("_method"));     // method-override
app.engine("ejs", ejsMate);     // layout rendering
app.use(express.static(path.join(__dirname, "/public")));       // serving static files
app.use(cookieParser());



const MONGO_URL = process.env.MONGO_URI;
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => {
        console.log(`Connected to DB`);
    })
    .catch((err) => {
        console.log(err);
    })

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // sameSite: 'none',
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});


app.get("/", (req, res) => {
    res.render("listings/homePage.ejs");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use('/', userRouter);


app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send({ message });
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is listening to ${port}`);
});