const {Schema, model} = require('mongoose') 

const Materials = new Schema({
    shortid: String,
    name: String,
    title: String,
    category: String,
    course: Number,
    subjects: [String],
    year: Number,
    rating: Number,
    resources: [{
        shortid: String,
        name: String,
        title: String,
        format: String,
        url: String,
        dateUp: String
    }],
    conspects: [{
        shortid: String,
        name: String,
        text: String,
        category: String,
        semester: String,
        image: String,
        likes: String
    }]
})

module.exports = model('Materials', Materials)