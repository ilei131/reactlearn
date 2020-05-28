//require('dotenv').config()
// const express = require('express')
// const app = express()
// app.use(express.static('build'))
// const cors = require('cors')
// app.use(cors())
// app.use(express.json())
//const Note = require('./models/note')
//const http = require('http')


// const requestLogger = (request, response, next) => {
//   logger.info('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)

// let notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     date: '2019-05-30T17:30:31.098Z',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only Javascript',
//     date: '2019-05-30T18:39:34.091Z',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     date: '2019-05-30T19:20:14.298Z',
//     important: true
//   }
// ]

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/api/notes', (request, response, next) => {
//   // const body = request.body
//   // console.log('body :>> ', body);
//   // if (!body.content) {
//   //   return response.status(400).json({
//   //     error: 'content missing'
//   //   })
//   // }

//   // const note = {
//   //   content: body.content,
//   //   important: body.important || false,
//   //   date: new Date(),
//   //   id: generateId(),
//   // }

//   // notes = notes.concat(note)

//   // response.json(note)

//   const body = request.body

//   if (body.content === undefined) {
//     return response.status(400).json({ error: 'content missing' })
//   }

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//   })

//   note.save()
//     .then(savedNote => {
//       response.json(savedNote.toJSON())
//     })
//     .catch(error => next(error))
// })

// app.get('/api/notes/:id', (request, response) => {
//   // const id = Number(request.params.id)
//   // const note = notes.find(note => {
//   //   console.log(note.id, typeof note.id, id, typeof id, note.id === id)
//   //   return note.id === id
//   // })
//   // if (note) {
//   //   response.json(note)
//   // } else {
//   //   response.status(404).end()
//   // }
//   Note.findById(request.params.id)
//     .then(note => {
//       if (note) {
//         response.json(note.toJSON())
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => {
//       console.log(error)
//       response.status(400).send({ error: 'malformatted id' })
//     })
// })

// app.get('/api/notes/:id', (request, response, next) => {
//   Note.findById(request.params.id)
//     .then(note => {
//       if (note) {
//         response.json(note.toJSON())
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })

// // app.delete('/api/notes/:id', (request, response) => {
// //   const id = Number(request.params.id)
// //   notes = notes.filter(note => note.id !== id)

// //   response.status(204).end()
// // })

// app.delete('/api/notes/:id', (request, response, next) => {
//   Note.findByIdAndRemove(request.params.id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

// app.get('/api/notes', (req, res) => {
//   Note.find({}).then(notes => {
//     res.json(notes.map(note => note.toJSON()))
//   })
// })

// app.put('/api/notes/:id', (request, response, next) => {
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }
//   /*
//   关于 findByIdAndUpdate方法的使用有一个重要的细节。
//   默认情况下，事件处理程序的 updatedNote 参数接收原始文档无需修改。
//   我们添加了可选的代码{ new: true }参数，这将导致使用新修改的文档而不是原始文档调用事件处理程序。
//   */
//   Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     .then(updatedNote => {
//       response.json(updatedNote.toJSON())
//     })
//     .catch(error => next(error))
// })

// // handler of requests with unknown endpoint
// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }
// app.use(unknownEndpoint)

// // handler of requests with result to errors
// const errorHandler = (error, request, response, next) => {
//   console.error(error.message)

//   if (error.name === 'CastError' && error.kind === 'ObjectId') {
//     return response.status(400).send({ error: 'malformatted id' })
//   } else if (error.name === 'ValidationError') {
//     return response.status(400).json({ error: error.message })
//   }

//   next(error)
// }
// app.use(errorHandler)

// const PORT = config.PORT
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

//https://segmentfault.com/a/1190000017576714   docsify - 生成文档网站简单使用教程
//https://www.jianshu.com/p/4883e95aa903 有了docsify神器，从此爱上看文档

const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')
const http = require('http')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})