const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
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

app.get('/' ,(req, res) => {
    res.render('home');
})

app.get('/campgrounds', async (req, res) =>{
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {campgrounds});
})
app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async(req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground}); 
})

app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    console.log('deleting campground')
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

app.patch('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    console.log(req.body.campground)
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
})


app.listen(3000, () => {
    console.log('listening on port', 3000);
})