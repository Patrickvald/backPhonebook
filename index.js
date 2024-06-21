const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const PORT = process.env.PORT || 3001

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
    res.json(phoneBook)
})

app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const contact = phoneBook.find(data => data.id === id)
    if(contact){
        res.json(contact)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    phoneBook = phoneBook.filter(contact => contact.id !== id)
    res.send(phoneBook)
    res.status(204).end()
})

const generatorId = ()=>{
    const id = Math.floor(Math.random()*99999)
    return id
}
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
    const newContact ={
        id:generatorId(),
        name:body.name,
        phone: body.phone
    }
    
    phoneBook = phoneBook.concat(newContact)
    res.json(phoneBook)
})

app.get('/info',(req,res)=>{
    const length = phoneBook.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${length} people. <br> Consulted on ${date}</p>`)
})




app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`); 
})

