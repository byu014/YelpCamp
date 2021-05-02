const mongoose = require('mongoose');
const path = require('path');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

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

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const randomPrice = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo qui a eum nostrum nobis saepe sit expedita enim rerum. Quis laborum error, hic nesciunt fuga optio. Quisquam repudiandae suscipit cupiditate.',
            price: randomPrice
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});