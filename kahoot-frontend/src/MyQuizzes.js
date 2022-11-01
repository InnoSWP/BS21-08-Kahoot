import Page from './Page'
import { useState, useEffect } from 'react'
import QuizCard from './QuizCard'

function MyQuizzes () {
  const [quizzes, setQuizzes] = useState([])
  const [quizName, setQuizName] = useState('')

  const handleCreateQuiz = (form) => {
    form.preventDefault()
    const curQuiz = {
      name: quizName
    }
    if (quizName !== '') {
      fetch('/api/v1/createQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz: curQuiz
        })
      }).then((res) => {
        if (res.status !== 200) {
          console.log('Error: ' + res.status)
          return
        }

        res.json().then((data) => {
          handleSetQuizzes()
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const handleSetQuizzes = () => {
    fetch('/api/v1/getQuizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      res.json().then((data) => {
        setQuizzes(data.quizzes)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  const handleRemoveQuiz = (_id) => {
    console.log(_id)
    fetch('/api/v1/removeQuiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: _id })
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      res.json().then((data) => {
        handleSetQuizzes()
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    handleSetQuizzes()
  }, [])

  return (
    <Page>
      <div className="text-center text-white"><h1>My Quizzes</h1></div>
      <div className="card">
        <form onSubmit={handleCreateQuiz}>
          <div className='quiz-name'>
            <input type="text" value={quizName} onChange={(e) => { setQuizName(e.target.value) }} className="input-general" placeholder="Quiz name" />
          </div>
          <div className="flex flex-nowrap justify-center mt-5">
            <input type='submit' value='Create a new quiz' className='block btn btn-green create-quiz-button shadow-md shadow-gray-700'/>
          </div>
        </form>
      </div>

      {
      !!quizzes.length && quizzes.map((quiz, index, arr) => (
        <QuizCard key={arr[arr.length - 1 - index]._id} _id={arr[arr.length - 1 - index]._id} name={arr[arr.length - 1 - index].name} handleRemoveQuiz={handleRemoveQuiz}/>
      ))
      }
    </Page>
  )
}

export default MyQuizzes
