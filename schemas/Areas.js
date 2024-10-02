const {Schema, model} = require('mongoose') 

const Areas = new Schema({
    shortid: String,
    name: String,
    title: String,
    category: String,
    century: String,
    region: String,
    cords: {
        lat: Number,
        long: Number
    },
    faculty: String,
    locations: [{
        shortid: String,
        name: String,
        title: String,
        category: String,
        term: String,
        cords: {
            lat: Number,
            long: Number
        },
        stage: String,
        image: String,
        likes: String
    }],
    facts: [{
        shortid: String,
        name: String,
        text: String,
        level: String,
        isTruth: Boolean,
        dateUp: String
    }]
})

module.exports = model('Areas', Areas)