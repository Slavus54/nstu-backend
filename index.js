require('dotenv').config()
const app = require('express')()
const {gql} = require('apollo-server-express')

const PORT = process.env.PORT || 4e3
const url = process.env.MONGO_URL

let gqlResponse = ''
let feedback = {shortid: '', name: ''}

// schemas

const Profiles = require('./schemas/Profiles')           
const Materials = require('./schemas/Materials')           
const Rooms = require('./schemas/Rooms')  
const Lectures = require('./schemas/Lectures')
const Areas = require('./schemas/Areas')
const Ideas = require('./schemas/Ideas')

// API

const faculties = require('./api/faculties.json')

// microservices

const {middleware, mongo_connect, apollo_start, sendEmail, create_password, compare_password, profileComponentMutate, transactionOptions, transactionErrorText, mongoText, shortid} = require('./utils/utils')
const {RegistrationEmail, PasswordChangeEmail} = require('./email/mailbox')

// middlewares

middleware(app)

// connect to MongoDB

mongo_connect(url, mongoText)

const typeDefs = gql`
    type Cord {
        lat: Float!,
        long: Float!
    }
    input ICord {
        lat: Float!,
        long: Float!
    }
    type ProfileCookiePayload {
        shortid: String!,
        name: String!
    }
    type AccountComponent {
        shortid: String!,
        title: String!,
        url: String!
    }
    type Achievement {
        shortid: String!,
        title: String!,
        category: String!,
        image: String!,
        dateUp: String!
    }
    type Project {
        shortid: String!,
        title: String!,
        category: String!,
        progress: Float!,
        image: String!,
        likes: String!
    }
    type Resource {
        shortid: String!,
        name: String!,
        title: String!,
        format: String!,
        url: String!,
        dateUp: String!
    }
    type Conspect {
        shortid: String!,
        name: String!,
        text: String!,
        category: String!,
        semester: String!,
        image: String!,
        likes: String!
    }
    type Member {
        shortid: String!,
        name: String!,
        role: String!
    }
    type Task {
        shortid: String!,
        name: String!,
        text: String!,
        category: String!,
        deadline: String!,
        image: String!
    }
    type Question {
        shortid: String!,
        name: String!,
        text: String!,
        level: String!,
        reply: String!,
        dateUp: String!
    }
    type Detail {
        shortid: String!,
        name: String!,
        title: String!,
        category: String!,
        image: String!,
        rating: Float!
    }
    type Location {
        shortid: String!,
        name: String!,
        title: String!,
        category: String!,
        term: String!,
        cords: Cord!,
        stage: String!,
        image: String!,
        likes: String!
    }
    type Fact {
        shortid: String!,
        name: String!,
        text: String!,
        level: String!,
        isTruth: Boolean!,
        dateUp: String!
    }
    type Thought {
        shortid: String!,
        name: String!,
        title: String!,
        category: String!,
        rating: Float!,
        image: String!
    }
    type Quote {
        shortid: String!,
        name: String!,
        text: String!,
        status: String!,
        faculty: String!,
        dateUp: String!
    }
    type Idea {
        id: ID!,
        shortid: String!,
        name: String!,
        title: String!,
        concept: String!,
        category: String!,
        url: String!,
        roles: [String]!,
        stage: String!,
        need: Float!,
        thoughts: [Thought]!,
        quotes: [Quote]!
    }
    type Area {
        id: ID!,
        shortid: String!,
        name: String!,
        title: String!,
        category: String!,
        century: String!,
        region: String!,
        cords: Cord!,
        faculty: String!,
        locations: [Location]!,
        facts: [Fact]!
    }
    type Lecture {
        id: ID!,
        shortid: String!,
        name: String!,
        title: String!,
        category: String!,
        status: String!,
        duration: String!,
        url: String!,
        time: String!,
        dateUp: String!,
        stream: String!,
        card: String!,
        questions: [Question]!,
        details: [Detail]!
    }
    type Room {
        id: ID!,
        shortid: String!,
        name: String!,
        title: String!,
        faculty: String!,
        dormitory: String!,
        num: Float!,
        weekday: String!,
        time: String!,
        cords: Cord!,
        members: [Member]!, 
        tasks: [Task]!
    }
    type Material {
        id: ID!,
        shortid: String!,
        name: String!,
        title: String!,
        category: String!,
        course: Float!,
        subjects: [String]!,
        year: Float!,
        rating: Float!,
        resources: [Resource]!,
        conspects: [Conspect]!
    }
    type Profile {
        shortid: String!,
        name: String!,
        email: String!,
        password: String!,
        region: String!,
        cords: Cord!,
        status: String!,
        image: String!,
        timestamp: String!,
        achievements: [Achievement]!,
        projects: [Project]!,
        components: [AccountComponent]!
    }
    type Query {
        getProfiles: [Profile]!
        getMaterials: [Material]!
        getRooms: [Room]!
        getLectures: [Lecture]!
        getAreas: [Area]!
        getIdeas: [Idea]!
    }
    type Mutation {
        registerProfile(name: String!, email: String!, password: String!, region: String!, cords: ICord!, status: String!, points: Float!, image: String!, timestamp: String!) : ProfileCookiePayload!
        loginProfile(name: String!, password: String!, timestamp: String!) : ProfileCookiePayload!
        getProfile(id: String!) : Profile
        updateProfilePersonalInfo(id: String!, image: String!) : String!
        updateProfileGeoInfo(id: String!, region: String!, cords: ICord!) : String!
        updateProfilePassword(id: String!, current_password: String!, new_password: String!) : String!
        manageProfileAchievement(id: String!, option: String!, title: String!, category: String!, image: String!, dateUp: String!, collId: String!) : String!
        manageProfileProject(id: String!, option: String!, title: String!, category: String!, progress: Float!, image: String!, likes: String!, collId: String!) : String!
        createMaterial(name: String!, id: String!, title: String!, category: String!, course: Float!, subjects: [String]!, year: Float!, rating: Float!) : String!
        getMaterial(id: String!) : Material!
        addMaterialResource(name: String!, id: String!, title: String!, format: String!, url: String!, dateUp: String!) : String!
        updateMaterialRating(name: String!, id: String!, rating: Float!) : String!
        manageMaterialConspect(name: String!, id: String!, option: String!, text: String!, category: String!, semester: String!, image: String!, likes: String!, collId: String!) : String!
        createRoom(name: String!, id: String!, title: String!, faculty: String!, dormitory: String!, num: Float!, weekday: String!, time: String!, cords: ICord!, role: String!) : String!
        getRoom(id: String!) : Room!
        manageRoomStatus(name: String!, id: String!, option: String!, role: String!) : String!
        updateRoomInformation(name: String!, id: String!, weekday: String!, time: String!) : String!
        manageRoomTask(name: String!, id: String!, option: String!, text: String!, category: String!, deadline: String!, image: String!, collId: String!) : String!
        createLecture(name: String!, id: String!, title: String!, category: String!, status: String!, duration: String!, url: String!, time: String!, dateUp: String!, stream: String!, card: String!) : String!
        getLecture(id: String!) : Lecture!
        manageLectureQuestion(name: String!, id: String!, option: String!, text: String!, level: String!, reply: String!, dateUp: String!, collId: String!) : String!
        updateLectureInformation(name: String!, id: String!, stream: String!, card: String!) : String!
        manageLectureDetail(name: String!, id: String!, option: String!, title: String!, category: String!, image: String!, rating: Float!, collId: String!) : String!
        createArea(name: String!, id: String!, title: String!, category: String!, century: String!, region: String!, cords: ICord!, faculty: String!) : String!
        getArea(id: String!) : Area!
        manageAreaLocation(name: String!, id: String!, option: String!, title: String!, category: String!, term: String!, cords: ICord!, stage: String!, image: String!, likes: String!, collId: String!) : String!
        updateAreaFaculty(name: String!, id: String!, faculty: String!) : String!
        offerAreaFact(name: String!, id: String!, text: String!, level: String!, isTruth: Boolean!, dateUp: String!) : String!
        createIdea(name: String!, id: String!, title: String!, concept: String!, category: String!, url: String!, roles: [String]!, stage: String!, need: Float!) : String!
        getIdea(id: String!) : Idea!
        manageIdeaThought(name: String!, id: String!, option: String!, title: String!, category: String!, rating: Float!, image: String!, collId: String!) : String!
        updateIdeaInformation(name: String!, id: String!, stage: String!, need: Float!) : String!
        publishIdeaQuote(name: String!, id: String!, text: String!, status: String!, faculty: String!, dateUp: String!) : String!
    }
`

const resolvers = {
    Query: {
        getProfiles: async () => {
            const profiles = await Profiles.find() 

            return profiles
        },
        getMaterials: async () => {
            const materials = await Materials.find()

            return materials
        },
        getRooms: async () => {
            const rooms = await Rooms.find()

            return rooms
        },
        getLectures: async () => {
            const lectures = await Lectures.find()

            return lectures
        },
        getAreas: async () => {
            const areas = await Areas.find()

            return areas
        },
        getIdeas: async () => {
            const ideas = await Ideas.find()

            return ideas
        }
    },
    Mutation: {
        registerProfile: async (_, {name, email, password, region, cords, status, image, timestamp}) => {
            const profile = await Profiles.findOne({name}) 

            if (profile === null) {

                const newProfile = new Profiles({
                    shortid,
                    name,
                    email,
                    password: await create_password(password),
                    region,
                    cords,
                    status,
                    image,
                    timestamp,
                    achievements: [],
                    projects: [],
                    components: []
                })

                let {subject, html} = RegistrationEmail(name)
              
                await sendEmail({to: email, subject, html})

                feedback = {shortid, name}
             
                await newProfile.save()
            } 
        
            return feedback
        },
        loginProfile: async (_, {name, password, timestamp}) => {
            const profile = await Profiles.findOne({name}) 
           
            if (profile) {  
               
                const check = await compare_password(password, profile.password)

                if (check) {

                    profile.timestamp = timestamp
                    
                    await Profiles.updateOne({name}, {$set: profile})

                    feedback = {shortid: profile.shortid, name: profile.name}
                }                               
            }

            return feedback
        },
        getProfile: async (_, {id}) => {
            const profile = await Profiles.findOne({shortid: id}) 
            
            return profile
        },
        updateProfilePersonalInfo: async (_, {id, image}) => {
            const profile = await Profiles.findOne({shortid: id}) 

            if (profile) {

                profile.image = image

                await Profiles.updateOne({shortid: id}, {$set: profile})

                return PERSONAL_INFO_SUCCESS
            }

            return PERSONAL_INFO_FALL
        },
        updateProfileGeoInfo: async (_, {id, region, cords}) => {
            const profile = await Profiles.findOne({shortid: id}) 

            if (profile) {

                profile.region = region
                profile.cords = cords
             
                await Profiles.updateOne({shortid: id}, {$set: profile})

                return GEO_INFO_UPDATED
            }

            return GEO_INFO_FALL
        },
        updateProfilePassword: async (_, {id, current_password, new_password}) => {
            const profile = await Profiles.findOne({shortid: id}) 

            if (profile) {

                const check = await compare_password(current_password, profile.password)

                if (check) {
                    profile.password = await create_password(new_password)
                }

                let {subject, html} = PasswordChangeEmail(profile.name)
              
                await sendEmail({to: profile.email, subject, html})

                await Profiles.updateOne({shortid: id}, {$set: profile})

                return PASSWORD_UPDATED
            }

            return PASSWORD_FALL
        },
        manageProfileAchievement: async (_, {id, option, title, category, image, dateUp, collId}) => {
            const profile = await Profiles.findOne({shortid: id}) 

            if (profile) {
                if (option === 'create') {
                    
                    profile.achievements = [...profile.achievements, {
                        shortid,
                        title,
                        category,
                        image,
                        dateUp
                    }]

                    gqlResponse = ACHIEVEMENT_CREATED

                } else if (option === 'delete') {

                    profile.achievements = profile.achievements.filter(el => el.shortid !== collId)
                
                    gqlResponse = ACHIEVEMENT_DELETED
                }

                await Profiles.updateOne({shortid: id}, {$set: profile})
            }
        
            return gqlResponse
        },
        manageProfileProject: async (_, {id, option, title, category, progress, image, likes, collId}) => {
            const profile = await Profiles.findOne({shortid: id}) 

            if (profile) {
                if (option === 'create') {

                    profile.projects = [...profile.projects, {
                        shortid,
                        title,
                        category,
                        progress,
                        image,
                        likes
                    }]

                    gqlResponse = PROJECT_CREATED

                } else if (option === 'delete') {

                    profile.projects = profile.projects.filter(el => el.shortid !== collId)
                
                    gqlResponse = PROJECT_DELETED

                } else {

                    profile.projects.map(el => {
                        if (el.shortid === collId) {
                            if (option === 'update') {

                                el.progress = progress
                                el.image = image

                                gqlResponse = PROJECT_UPDATED

                            } else if (option === 'like') {

                                el.likes = likes

                                gqlResponse = PROJECT_LIKED
                            }
                        }
                    })
                }

                await Profiles.updateOne({shortid: id}, {$set: profile})
            }
        
            return gqlResponse
        },
        createMaterial: async (_, {name, id, title, category, course, subjects, year, rating}) => {
            const profile = await Profiles.findOne({name, shortid: id}) 
            const material = await Materials.findOne({title})

            if (profile && !material) {
                if (profile.components.filter(el => el.url === 'material').find(el => el.title === title) === undefined) {

                    profile.components = [...profile.components, profileComponentMutate({shortid, title}, 'material')]
                
                    const newMaterial = new Materials({
                        shortid,
                        name,
                        title,
                        category,
                        course,
                        subjects,
                        year,
                        rating,
                        resources: [],
                        conspects: []
                    })

                    const session = await Profiles.startSession()
                
                    try {
                        await session.withTransaction(async () => {
                            await Profiles.updateOne({name, shortid: id}, {$set: profile})
                            await newMaterial.save()
                        }, transactionOptions)
                    } catch (err) {
                        console.log(transactionErrorText, err)
                    } finally {
                        await session.endSession()
                    }
                }
            }

            return gqlResponse
        },
        getMaterial: async (_, {id}) => {
            const material = await Materials.findOne({shortid: id})

            return material
        },
        addMaterialResource: async (_, {name, id, title, format, url, dateUp}) => {
            const profile = await Profiles.findOne({name})
            const material = await Materials.findOne({shortid: id})
       
            if (profile && material) {
                
                material.resources = [...material.resources, {
                    shortid,
                    name,
                    title,
                    format,
                    url,
                    dateUp
                }]

                await Materials.updateOne({shortid: id}, {$set: material})
            }

            return gqlResponse
        },
        updateMaterialRating: async (_, {name, id, rating}) => {
            const profile = await Profiles.findOne({name})
            const material = await Materials.findOne({shortid: id})
       
            if (profile && material) {

                material.rating = rating

                await Materials.updateOne({shortid: id}, {$set: material})
            }

            return gqlResponse
        },
        manageMaterialConspect: async (_, {name, id, option, text, category, semester, image, likes, collId}) => {
            const profile = await Profiles.findOne({name})
            const material = await Materials.findOne({shortid: id})
       
            if (profile && material) {
                if (option === 'create') {

                    material.conspects = [...material.conspects, {
                        shortid,
                        name,
                        text,
                        category,
                        semester,
                        image,
                        likes
                    }]

                } else if (option === 'like') {

                    material.conspects.map(el => {
                        if (el.shortid === collId) {
                            el.likes = likes
                        }
                    })

                } else {

                    material.conspects = material.conspects.filter(el => el.shortid !== collId)
                }

                await Materials.updateOne({shortid: id}, {$set: material})
            }

            return gqlResponse
        },
        createRoom: async (_, {name, id, title, faculty, dormitory, num, weekday, time, cords, role}) => {
            const profile = await Profiles.findOne({name, shortid: id}) 
            const room = await Rooms.findOne({dormitory, num})
            
            if (profile && !room) {
                if (profile.components.filter(el => el.url === 'room').find(el => el.title === title) === undefined) {
                    
                    profile.components = [...profile.components, profileComponentMutate({shortid, title}, 'room')]

                    const newRoom = new Rooms({
                        shortid,
                        name,
                        title,
                        faculty,
                        dormitory,
                        num,
                        weekday,
                        time,
                        cords,
                        members: [{
                            shortid: profile.shortid,
                            name,
                            role
                        }], 
                        tasks: []
                    })

                    const session = await Profiles.startSession()
                
                    try {
                        await session.withTransaction(async () => {
                            await Profiles.updateOne({name, shortid: id}, {$set: profile})
                            await newRoom.save()
                        }, transactionOptions)
                    } catch (err) {
                        console.log(transactionErrorText, err)
                    } finally {
                        await session.endSession()
                    }
                }
            }

            return gqlResponse
        },
        getRoom: async (_, {id}) => {
            const room = await Rooms.findOne({shortid: id})

            return room
        },
        manageRoomStatus: async (_, {name, id, option, role}) => {
            const profile = await Profiles.findOne({name})
            const room = await Rooms.findOne({shortid: id})
        
            if (profile && room) {
                if (option === 'join') {

                    profile.components = [...profile.components, profileComponentMutate(room, 'room')]

                    room.members = [...room.members, {
                        shortid: profile.shortid,
                        name,
                        role
                    }]

                } else if (option === 'update') {

                    room.members.map(el => {
                        if (el.shortid === profile.shortid) {
                            el.role = role
                        }
                    })

                } else {

                    profile.components = profile.components.filter(el => el.shortid !== room.shortid)

                    room.members = room.members.filter(el => el.shortid !== profile.shortid)
                }

                const session = await Profiles.startSession()
                
                try {
                    await session.withTransaction(async () => {
                        await Profiles.updateOne({name}, {$set: profile})
                        await Rooms.updateOne({shortid: id}, {$set: room})
                    }, transactionOptions)
                } catch (err) {
                    console.log(transactionErrorText, err)
                } finally {
                    await session.endSession()
                }
            }

            return gqlResponse
        },
        updateRoomInformation: async (_, {name, id, weekday, time}) => {
            const profile = await Profiles.findOne({name})
            const room = await Rooms.findOne({shortid: id})
        
            if (profile && room) {

                room.weekday = weekday
                room.time = time

                await Rooms.updateOne({shortid: id}, {$set: room})
            }

            return gqlResponse
        },
        createLecture: async (_, {name, id, title, category, status, duration, url, time, dateUp, stream, card}) => {
            const profile = await Profiles.findOne({name, shortid: id})
            const lecture = await Lectures.findOne({title, dateUp})
       
            if (profile && !lecture) {
                if (profile.components.filter(el => el.url === 'lecture').find(el => el.title) === undefined) {

                    profile.components = [...profile.components, profileComponentMutate({shortid, title}, 'lecture')]

                    const newLecture = new Lectures({
                        shortid,
                        name,
                        title,
                        category,
                        status,
                        duration,
                        url,
                        time,
                        dateUp,
                        stream,
                        card,
                        questions: [],
                        details: []
                    })

                    const session = await Profiles.startSession()
                
                    try {
                        await session.withTransaction(async () => {
                            await Profiles.updateOne({name, shortid: id}, {$set: profile})
                            await newLecture.save()
                        }, transactionOptions)
                    } catch (err) {
                        console.log(transactionErrorText, err)
                    } finally {
                        await session.endSession()
                    }
                }
            }

            return gqlResponse
        },
        getLecture: async (_, {id}) => {
            const lecture = await Lectures.findOne({shortid: id})

            return lecture
        },
        manageLectureQuestion: async (_, {name, id, option, text, level, reply, dateUp, collId}) => {
            const profile = await Profiles.findOne({name})
            const lecture = await Lectures.findOne({shortid: id})

            if (profile && lecture) {
                if (option === 'create') {

                    lecture.questions = [...lecture.questions, {
                        shortid,
                        name,
                        text,
                        level,
                        reply,
                        dateUp
                    }]

                } else if (option === 'reply') {

                    lecture.questions.map(el => {
                        if (el.shortid === collId) {
                            el.reply = reply
                        }
                    })

                } else {

                    lecture.questions = lecture.questions.filter(el => el.shortid !== collId)
                }

                await Lectures.updateOne({shortid: id}, {$set: lecture})
            }

            return gqlResponse
        },
        updateLectureInformation: async (_, {name, id, stream, card}) => {
            const profile = await Profiles.findOne({name})
            const lecture = await Lectures.findOne({shortid: id})

            if (profile && lecture) {

                lecture.stream = stream
                lecture.card = card

                await Lectures.updateOne({shortid: id}, {$set: lecture})
            }

            return gqlResponse
        },
        manageLectureDetail: async (_, {name, id, option, title, category, image, rating, collId}) => {
            const profile = await Profiles.findOne({name})
            const lecture = await Lectures.findOne({shortid: id})

            if (profile && lecture) {
                if (option === 'create') {

                    lecture.details = [...lecture.details, {
                        shortid,
                        name,
                        title,
                        category,
                        image,
                        rating
                    }]

                } else if (option === 'rate') {

                    lecture.details.map(el => {
                        if (el.shortid === collId) {
                            el.rating = rating
                        }
                    })

                } else {

                    lecture.details = lecture.details.filter(el => el.shortid !== collId)
                }

                await Lectures.updateOne({shortid: id}, {$set: lecture})
            }

            return gqlResponse
        },
        createArea: async (_, {name, id, title, category, century, region, cords, faculty}) => {
            const profile = await Profiles.findOne({name, shortid: id})
            const area = await Areas.findOne({title})

            if (profile && !area) {
                if (profile.components.filter(el => el.url === 'area').find(el => el.title === title) === undefined) {
                 
                    profile.components = [...profile.components, profileComponentMutate({shortid, title}, 'area')]

                    const newArea = new Areas({
                        shortid,
                        name,
                        title,
                        category,
                        century,
                        region,
                        cords,
                        faculty,
                        locations: [],
                        facts: []
                    })

                    const session = await Profiles.startSession()
                
                    try {
                        await session.withTransaction(async () => {
                            await Profiles.updateOne({name, shortid: id}, {$set: profile})
                            await newArea.save()
                        }, transactionOptions)
                    } catch (err) {
                        console.log(transactionErrorText, err)
                    } finally {
                        await session.endSession()
                    }
                }
            }

            return gqlResponse
        },
        getArea: async (_, {id}) => {
            const area = await Areas.findOne({shortid: id})

            return area
        },
        manageAreaLocation: async (_, {name, id, option, title, category, term, cords, stage, image, likes, collId}) => {
            const profile = await Profiles.findOne({name})
            const area = await Areas.findOne({shortid: id})
        
            if (profile && area) {
                if (option === 'create') {

                    area.locations = [...area.locations, {
                        shortid,
                        name,
                        title,
                        category,
                        term,
                        cords,
                        stage,
                        image,
                        likes
                    }]

                } else if (option === 'delete') {

                    area.locations = area.locations.filter(el => el.shortid !== collId)
                    
                } else {

                    area.locations.map(el => {
                        if (el.shortid === collId) {
                            if (option === 'update') {

                                el.stage = stage
                                el.image = image

                            } else if (option === 'like') {

                                el.likes = likes
                            }
                        }
                    })
                }

                await Areas.updateOne({shortid: id}, {$set: area})
            }

            return gqlResponse
        },
        updateAreaFaculty: async (_, {name, id, faculty}) => {
            const profile = await Profiles.findOne({name})
            const area = await Areas.findOne({shortid: id})
        
            if (profile && area) {

                area.faculty = faculty
            
                await Areas.updateOne({shortid: id}, {$set: area})
            }

            return gqlResponse
        },
        offerAreaFact: async (_, {name, id, text, level, isTruth, dateUp}) => {
            const profile = await Profiles.findOne({name})
            const area = await Areas.findOne({shortid: id})
        
            if (profile && area) {

                area.facts = [...area.facts, {
                    shortid,
                    name,
                    text,
                    level,
                    isTruth,
                    dateUp
                }]

                await Areas.updateOne({shortid: id}, {$set: area})
            }

            return gqlResponse
        },
        createIdea: async (_, {name, id, title, concept, category, url, roles, stage, need}) => {
            const profile = await Profiles.findOne({name, shortid: id})
            const idea = await Ideas.findOne({title})

            if (profile && !idea) {
                if (profile.components.filter(el => el.url === 'idea').find(el => el.title === title) === undefined) {

                    profile.components = [...profile.components, profileComponentMutate({shortid, title}, 'idea')]

                    const newIdea = new Ideas({
                        shortid,
                        name,
                        title,
                        concept,
                        category,
                        url,
                        roles,
                        stage,
                        need,
                        thoughts: [],
                        quotes: []
                    })

                    const session = await Profiles.startSession()
                
                    try {
                        await session.withTransaction(async () => {
                            await Profiles.updateOne({name, shortid: id}, {$set: profile})
                            await newIdea.save()
                        }, transactionOptions)
                    } catch (err) {
                        console.log(transactionErrorText, err)
                    } finally {
                        await session.endSession()
                    }
                }
            }

            return gqlResponse
        },
        getIdea: async (_, {id}) => {
            const idea = await Ideas.findOne({shortid: id})

            return idea
        },
        manageIdeaThought: async (_, {name, id, option, title, category, rating, image, collId}) => {
            const profile = await Profiles.findOne({name})
            const idea = await Ideas.findOne({shortid: id})
        
            if (profile && idea) {
                if (option === 'create') {

                    idea.thoughts = [...idea.thoughts, {
                        shortid,
                        name,
                        title,
                        category,
                        rating,
                        image
                    }]

                } else if (option === 'rate') {

                    idea.thoughts.map(el => {
                        if (el.shortid === collId) {
                            el.rating = rating
                        }
                    })

                } else {

                    idea.thoughts = idea.thoughts.filter(el => el.shortid !== collId)
                }

                await Ideas.updateOne({shortid: id}, {$set: idea})
            }

            return gqlResponse
        },
        updateIdeaInformation: async (_, {name, id, stage, need}) => {
            const profile = await Profiles.findOne({name})
            const idea = await Ideas.findOne({shortid: id})
        
            if (profile && idea) {
                
                idea.stage = stage
                idea.need = need

                await Ideas.updateOne({shortid: id}, {$set: idea})
            }

            return gqlResponse
        },
        publishIdeaQuote: async (_, {name, id, text, status, faculty, dateUp}) => {
            const profile = await Profiles.findOne({name})
            const idea = await Ideas.findOne({shortid: id})
        
            if (profile && idea) {
                
                idea.quotes = [...idea.quotes, {
                    shortid,
                    name,
                    text,
                    status,
                    faculty,
                    dateUp
                }]

                await Ideas.updateOne({shortid: id}, {$set: idea})
            }

            return gqlResponse
        }




    }
}

apollo_start(typeDefs, resolvers, app)

app.get('/faculties', async (req, res) => {
    res.send(faculties)
})

app.post('/get-profile', async (req, res) => {
    let {name} = req.body
    let profile = await Profiles.findOne({name})

    res.send(profile ?? null) 
})

app.listen(PORT, () => console.log(`Server started on ${PORT} port`))

// notifications

const {  
    PERSONAL_INFO_SUCCESS, PERSONAL_INFO_FALL,
    GEO_INFO_UPDATED, GEO_INFO_FALL, 
    PASSWORD_UPDATED, PASSWORD_FALL,
    ACHIEVEMENT_CREATED, ACHIEVEMENT_DELETED,
    PROJECT_CREATED, PROJECT_UPDATED, PROJECT_LIKED, PROJECT_DELETED
} = require('./notifications/profile')