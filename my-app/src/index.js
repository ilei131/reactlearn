//import React from 'react';
//import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
// const App = () => (
//   <div>
//     <p>Hello world</p>
//   </div>
// )

// const Hello = () => {
//   return (
//     <div>
//       <p>Hello world</p>
//     </div>
//   )
// }

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Note from './components/Note'
import NoteForm from './components/NoteForm'
import noteService from './services/notes'
import './index.css'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  // const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    console.log('effect')
    noteService
      .getAll()
      .then(data => {
        console.log('promise fulfilled')
        console.log('data :>> ', data)
        setNotes(data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // const addNote = (event) => {
  //   event.preventDefault()
  //   console.log('button clicked', event.target)
  //   const noteObject = {
  //     content: newNote,
  //     date: new Date().toISOString(),
  //     important: Math.random() < 0.5,
  //     userId: user.userId
  //   }
  //   noteService
  //     .create(noteObject)
  //     .then(data => {
  //       console.log('addNote Response Data :>> ', data);
  //       setNotes(notes.concat(data))
  //       setNewNote('')
  //     })
  //     .catch(error => {
  //       console.log('addNoteError :>> ', error)
  //       console.log('error.response.data :>> ', error.response.data)
  //       let msg = error.response.data['error']
  //       console.log('error.response.data.content :>> ', msg)

  //       if (msg) {
  //         setErrorMessage(
  //           msg
  //         )
  //         setTimeout(() => {
  //           setErrorMessage(null)
  //         }, 5000)
  //       }
  //     })
  // }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteObject.userId = user.userId
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  // const handleNoteChange = (event) => {
  //   console.log(event.target.value)
  //   setNewNote(event.target.value)
  // }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(data => {
        setNotes(notes.map(note => note.id !== id ? note : data))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      console.log('user :>> ', user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    // <form onSubmit={handleLogin}>
    //   <div>
    //     username
    //       <input
    //       type="text"
    //       value={username}
    //       name="Username"
    //       onChange={({ target }) => setUsername(target.value)}
    //     />
    //   </div>
    //   <div>
    //     password
    //       <input
    //       type="password"
    //       value={password}
    //       name="Password"
    //       onChange={({ target }) => setPassword(target.value)}
    //     />
    //   </div>
    //   <button type="submit">login</button>
    // </form>
    <LoginForm handleSubmit={handleLogin}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      username={username}
      password={password}/>
  )

  const noteFormRef = React.createRef()

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <Footer />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)