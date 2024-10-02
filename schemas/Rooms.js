const {Schema, model} = require('mongoose') 

const Rooms = new Schema({
    shortid: String,
    name: String,
    title: String,
    faculty: String,
    dormitory: String,
    num: Number,
    weekday: String,
    time: String,
    cords: {
        lat: Number,
        long: Number
    },
    members: [{
        shortid: String,
        name: String,
        role: String
    }], 
    tasks: [{
        shortid: String,
        name: String,
        text: String,
        category: String,
        deadline: String,
        image: String
    }]
})

module.exports = model('Rooms', Rooms)