// run: node mongo.js password

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-pcvae.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

// const note = new Note({
//   content: 'Browser can execute only Javascript',
//   date: new Date(),
//   important: true,
// })

// note.save().then(response => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// The parameter of the method is an object expressing search conditions.
// Since the parameter is an empty object{}, we get all of the notes stored in the notes collection.
// We could restrict our search to only include important notes like this:
// Note.find({ important: true }).then(result => {
//   // ...
// })
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})