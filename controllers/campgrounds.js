const Campground = require('../models/campground');

module.exports.index = async (req, res) =>{
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;//req.user created by passport
    await newCampground.save();
    req.flash('success', 'Sucessfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({path:'reviews', populate:{path:'author'}}).populate('author');
    if(!campground){
        req.flash('error', 'Campground does not exist');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground}); 
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground does not exist');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds')
}