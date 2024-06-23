const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config();

if(process.argv.length<3){
    console.log('Give password as argumen');
    process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGO_URI

mongoose.set('strictQuery',false)

mongoose.connect(url).then(()=>{
    console.log('Connected successfully');
    if(process.argv.length === 3){
        findContacts();
    }else if(process.argv.length === 5){
        const name = process.argv[3]
        const phone = process.argv[4]
        saveContact(name,phone)
    }else{
        console.log('There was an error, just write password, name and phone or just password please');
        mongoose.connection.close()
    }
})

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String
})

const Contact = mongoose.model('Contact', contactSchema)

const saveContact= (name, phone)=>{
    const contact = new Contact({name, phone});
    contact.save()
    .then(result => {
        console.log('contact saved!')
        mongoose.connection.close()
    }).catch(error => {
        console.error('Error saving contact:', error.message);
    }); 
}
    
const findContacts = ()=>{
    Contact.find({})
    .then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
    })
    .catch(error => {
        console.error('Error getting your contacts', error.message);
        mongoose.connection.close()
    })
}
