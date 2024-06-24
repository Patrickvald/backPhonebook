const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const app = express()
const Contact = require('./models/contact')
const PORT = process.env.PORT || process.env.PUERTOLOCAL

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
    Contact.findByIdAndDelete(req.params.id)
        .then(result =>{
            res.json(result)
            res.status(204).end()
        }).catch(error => next(error))
})

app.post('/api/persons',(req,res, next)=>{
    const body = req.body
    
    const contact = new Contact({
        name: body.name,
        phone: body.phone
    })
    
    contact.save().then(saveContact =>{
        res.json(saveContact)
    }).catch(error => next(error))
})

app.put('/api/persons/:id',(req,res,next)=>{
    const body = req.body
    const contact = {
        name: body.name,
        phone: body.phone
    }
    Contact.findByIdAndUpdate(req.params.id,contact,{new:true, runValidators: true, context:'query'})
        .then(result =>{
            res.json(result)
        }).catch(error => next(error))
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

const unknownEndpoint = (req,res) =>{
    res.status(404).send({error:'Unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) =>{
    console.log(error.message)
    if(error.name === 'CastError'){
        return res.status(400).send({error:'Wrong Id'})
    }else if(error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`); 
})

