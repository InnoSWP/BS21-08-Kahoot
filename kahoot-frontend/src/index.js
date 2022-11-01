import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './Navbar'
import Home from './Home'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Play from './Play'
import MyQuizzes from './MyQuizzes'
import EditQuiz from './EditQuiz'
import RunQuiz from './RunQuiz'

export default function App () {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/play" element={<Play />} />
          <Route path="/myQuizzes" element={<MyQuizzes />} />
          <Route path="/editQuiz" element={<EditQuiz />} />
          <Route path="/runQuiz" element={<RunQuiz />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
