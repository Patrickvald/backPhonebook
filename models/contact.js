const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGO_URI

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB');    
    })
    .catch(error => {
        console.log('There was an error: ', error.message);     
    })

const contactSchema = new mongoose.Schema({
    name: {
        type:String,
        minLength:3,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
})

contactSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)