const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('person', (request) => {
  if (request.method ===  'POST') {
    // console.log(request.body)
    return JSON.stringify(request.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  n = persons.length
  time = new Date()
  response.send(
    `<div>Phonebook has info for ${n} people</div>
    <br>
    <div>${time}</div>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const newId = Math.floor(Math.random() * 1000000000)
  if (persons.find(p => p.id === newId)) {
    return generateId()
  } else {
    return newId
  }
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Entry must have a name and number'
    })
  } else if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'Name already exists in the phonebook'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
