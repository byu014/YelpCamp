const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

const Campground = require('../models/campground');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground,catchAsync(campgrounds.createCampground))

router.get('/new',isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn , catchAsync(campgrounds.deleteCampground))
    .patch(isLoggedIn , isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;