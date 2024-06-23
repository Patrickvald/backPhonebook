const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const app = express()
const Contact = require('./models/contact')
const PORT = process.env.PORT || process.env.PUERTOLOCAL

let phoneBook = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.use(cors())
app.use(express.json())//Debe ir antes, o el requestLogger no entenderá el request.body
app.use(express.static('dist'))
// We have to use one token to pick up the post body
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });
  
// Now we use Morgan with its token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
  
/* app.use(morgan('tiny'))

app.use((req,res,next)=>{
    if(req.method === 'POST'){
        console.log('POST BODY: ',req.body);
    }
    next()
})
 */

app.get('/',(req,res)=>{
    res.send('<h1>Hello World¡</h1>')
})

app.get('/api/persons',(req,res) =>{
    Contact.find({}).then(contacts =>
        res.json(contacts)
    )
})

app.get('/api/persons/:id',(req,res)=>{
    Contact.findById(req.params.id).then(contact =>{
        res.json(contact)
    })
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    phoneBook = phoneBook.filter(contact => contact.id !== id)
    res.send(phoneBook)
    res.status(204).end()
})

app.post('/api/persons',(req,res)=>{
    const body = req.body
    console.log(body.name);
    console.log(body.phone);
    
    if(!body.name || !body.phone){;      
        return res.status(404).json({error:'name or number is missing'})
    } 

    if(phoneBook.find(data => data.name === body.name)){
        return res.status(404).json({error:'Name is already in use'})
    }
    const contact = new Contact({
        name: body.name,
        phone: body.phone
    })
    
    contact.save().then(saveContact =>{
        res.json(saveContact)
    })
})

app.get('/info',(req,res)=>{
    Contact.find({})
        .then(contacts =>{
            const length = contacts.length
            const date = new Date()
            res.send(`<p>Phonebook has info for ${length} people. <br> Consulted on ${date}</p>`)
        }).catch(error =>{
            res.status(500).send('Error getting the info') 
        })
})




app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`); 
})

