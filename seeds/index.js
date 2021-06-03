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
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('DB connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const randomPrice = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "6095fa4037ecef49c85cd969",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url:'https://res.cloudinary.com/dowvcrx9e/image/upload/v1622200850/YelpCamp/nclxow18ejjqtxrnkoar.png',
                    filename: 'YelpCamp/nclxow18ejjqtxrnkoar'
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo qui a eum nostrum nobis saepe sit expedita enim rerum. Quis laborum error, hic nesciunt fuga optio. Quisquam repudiandae suscipit cupiditate.',
            price: randomPrice
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});