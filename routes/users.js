const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req,res) => {
    res.render('users/register');
})

router.post('/register',catchAsync(async(req, res, next) =>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, err =>{if(err)return next(err)});
        req.flash('success',`Welcome to Yelp Camp, ${username}!`);
        res.redirect('/campgrounds');
    }catch(err){
        req.flash('error', err.message);
        res.render('users/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login',passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo? req.session.returnTo: '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds')
})

module.exports = router;