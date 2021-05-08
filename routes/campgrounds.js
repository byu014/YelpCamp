const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn} = require('../middleware');

const Campground = require('../models/campground');

const {campgroundSchema} = require('../schemas.js');

const validateCampground = (req, res , next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

router.get('/', catchAsync(async (req, res) =>{
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {campgrounds});
}))

router.get('/new',isLoggedIn, (req,res) => {
    res.render('campgrounds/new');
}) 

router.post('/',isLoggedIn, validateCampground,catchAsync(async(req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'Sucessfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', 'Campground does not exist');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground}); 
}))

router.delete('/:id',isLoggedIn , catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds')
}))

router.patch('/:id',isLoggedIn ,validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`);
}))

router.get('/:id/edit',isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground does not exist');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}))

module.exports = router;