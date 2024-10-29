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

const listingRouter = require('./routes/listingRouter.js');
const reviewRouter = require('./routes/reviewRouter.js');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log(`Connected to DB`);
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
    secret: '',
    resave: false,
    saveUninitialized: true
}


app.get("/", (req, res) => {
    res.send(`Hi, I'm root`);
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);


app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send({ message });
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is listening to ${port}`);
});