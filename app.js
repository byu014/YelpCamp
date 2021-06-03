if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connectione rror:"));
db.once("open", () => {
    console.log('DB connected');
});
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, 'views') );

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));//safer to use absolute paths since its relative to directory wherenode process is ran
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//how to store and unstore from session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


app.get('/' ,(req, res) => {
    res.render('../home');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('listening on port', 3000);
})