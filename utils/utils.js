require('dotenv').config()
const mongoose = require('mongoose')
const body_parser = require('body-parser')
const uniqid = require('uniqid')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const {ApolloServer} = require('apollo-server-express')
const {Datus, weekdaysTitles} = require('datus.js')

const datus = new Datus()

const common_middleware = async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    
    next()
}

const middleware = (app, limit = '10mb') => {
    app.use(common_middleware)
    app.use(body_parser.urlencoded({extended: true}))
    app.use(body_parser.json({limit}))
}

const mongo_connect = async (url, label = 'MongoDB connected') => {
    await mongoose.connect(url).then(() => console.log(label))
}

const apollo_start = async (typeDefs, resolvers, app) => {
    let server = new ApolloServer({typeDefs, resolvers})

    await server.start()
    await server.applyMiddleware({app})
}

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
        user: process.env.EMAIL_AUTH_LOGIN,
        pass: process.env.EMAIL_AUTH_PASSWORD
    }
})

const sendEmail = async ({to, subject, html}) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_AUTH_LOGIN,
            to,
            subject,
            html
        })
    } catch (err) {
        console.log(err)
    }
}

const create_password = async (password = '', salt = 5) => {  
    let bSalt = await bcrypt.genSalt(salt)
    let result = await bcrypt.hash(password, bSalt)
    
    return result
}

const compare_password = async (plain = '', hashed = '') => {
    let check = await bcrypt.compare(plain, hashed)

    return check
}

const profileComponentMutate = (component, url = '') => {
    if (component === null) {
        return {}
    }

    const {shortid, title} = component

    return {shortid, title, url}
}

const transactionOptions = {readPreference: 'primary', readConcern: {level: 'local'}, writeConcern: {w: 'majority'}}
const transactionErrorText = 'Transaction aborted with an error'

const mongoText = 'MongoDB is connected...'

const shortid = uniqid()

module.exports = {
    middleware,
    mongo_connect,
    apollo_start,
    sendEmail,
    create_password,
    compare_password,
    profileComponentMutate,
    transactionOptions,
    transactionErrorText,
    mongoText,
    shortid
}