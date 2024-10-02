const {Schema, model} = require('mongoose') 

const Profiles = new Schema({
    shortid: String,
    name: String,
    email: String,
    password: String,
    region: String,
    cords: {
        lat: Number,
        long: Number
    },
    status: String,
    points: Number,
    image: String,
    timestamp: String,
    achievements: [{
        shortid: String,
        title: String,
        category: String,
        image: String,
        dateUp: String
    }],
    projects: [{
        shortid: String,
        title: String,
        category: String,
        progress: Number,
        image: String,
        likes: String
    }],
    components: [{
        shortid: String,
        title: String,
        url: String
    }]
})

module.exports = model('Profiles', Profiles)