// // import http from 'http' // no support yet
// const http = require('http')
const express = require('express')
const app = express()
/*
  Without a body-parser, the body property would be undefined.
  The body-parser functions so that it takes the JSON data of a request,
  transforms it into a JavaScript object and then attaches it to the body
  property of the request object before the route handler is called.
*/
const bodyParser = require('body-parser')
app.use(bodyParser.json())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

// const app = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'application/json' })
//   // The notes array gets transformed into JSON with the JSON.stringify(notes) method.
//   res.end(JSON.stringify(notes))
// })

/*
  The event handler function accepts two parameters. 
  The first request parameter contains all of the information of the HTTP request,
  and the second response parameter is used to define how the request is responded to.

  In our code, the request is answered by using the send method of the response object.
  Calling the method makes the server respond to the HTTP request by sending a response
  containing the string <h1>Hello World!</h1>, that was passed to the send method.
  Since the parameter is a string, express automatically sets the value of the
  Content-Type header to be text/html. The status code of the response defaults to 200.
*/
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

/*
  The second route defines an event handler,
  that handles HTTP GET requests made to the notes path of the application:
*/
app.get('/notes', (req, res) => {
  res.json(notes)
  /*
    You will be able to spot this missing Content-Type header
    if at some point in your code you print all of the request
    headers with the console.log(request.headers) command.
  */
  console.log(request.headers)
})
/*
  The request is responded to with the json method of the response object.
  Calling the method will send the notes array that was passed to it as a 
  JSON formatted string. Express automatically sets the Content-Type header
  with the appropriate value of application/json.
*/

app.get('/notes/:id', (request, response) => {
  /* 
    This code won't run: The cause of the bug becomes clear.
    The id variable contains a string '1', whereas the id's of notes are integers.
    In JavaScript, the "triple equals" comparison === considers all values of different
    types to not be equal by default, meaning that 1 is not '1'.
  */
  const id = request.params.id // we need to convert it to a number: Number(request.params.id)
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  // if no note is found, respond with error status code
  if (note) {
    response.json(note)
  } else {
    // 404 not found
    response.status(404).end()
  }
})

app.delete('/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  // 204 no content
  response.status(204).end()
  // we respond to the request with the status code 204 no content
  // and return no data with the response.
})

/*
  notes.map(n => n.id) creates a new array that contains all the id's of the notes.
  Math.max returns the maximum value of the numbers that are passed to it. However,
  notes.map(n => n.id) is an array so it can't directly be given as a parameter to Math.max.
  The array can be transformed into individual numbers by using the "three dot" spread syntax ....
*/
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    // 400 bad request
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)
  response.json(note)
})


const PORT = 3333
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
