const {Schema, model} = require('mongoose') 

const Lectures = new Schema({
    shortid: String,
    name: String,
    title: String,
    category: String,
    status: String,
    duration: String,
    url: String,
    time: String,
    dateUp: String,
    stream: String,
    card: String,
    questions: [{
        shortid: String,
        name: String,
        text: String,
        level: String,
        reply: String,
        dateUp: String
    }],
    details: [{
        shortid: String,
        name: String,
        title: String,
        category: String,
        image: String,
        rating: Number
    }]
})

module.exports = model('Lectures', Lectures)