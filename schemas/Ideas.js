const {Schema, model} = require('mongoose') 

const Ideas = new Schema({
    shortid: String,
    name: String,
    title: String,
    concept: String,
    category: String,
    url: String,
    roles: [String],
    stage: String,
    need: Number,
    thoughts: [{
        shortid: String,
        name: String,
        title: String,
        category: String,
        rating: Number,
        image: String
    }],
    quotes: [{
        shortid: String,
        name: String,
        text: String,
        status: String,
        faculty: String,
        dateUp: String
    }]
})

module.exports = model('Ideas', Ideas)