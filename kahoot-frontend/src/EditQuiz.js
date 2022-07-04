import Page from './Page'
import QuestionCard from './QuestionCard'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function EditQuiz () {
  const [quiz, setQuiz] = useState()
  const [newQuestionName, setNewQuestionName] = useState('')
  const [newOptions, setNewOptions] = useState(['', '', '', ''])
  const [newOptionsCorrect, setNewOptionsCorrect] = useState([false, false, false, false])
  const [imgPath, setImgPath] = useState('')
  const [newTimeout, setNewTimeout] = useState(10)
  const [searchParams] = useSearchParams()

  const handleSetQuiz = () => {
    fetch('/api/v1/getQuiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: searchParams.get('quizId') })
    })
      .then((res) => {
        if (res.status !== 200) {
          console.log('Error: ' + res.status)
          return
        }

        res.json().then((data) => {
          setQuiz(data.quiz)
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSetImage = (event) => {
    const formData = new FormData()
    formData.append('file', event.target.files[0])
    formData.append('fileName', event.target.files[0].name)
    fetch('/api/v1/uploadImage', {
      method: 'POST',
      body: formData
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      res.json().then((data) => {
        console.log(data.path)
        setImgPath(`/files/pix/${data.path}`)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  const handleAddQuestion = (form) => {
    form.preventDefault()
    const curQuestion = {
      question: newQuestionName,
      image: imgPath === '' ? '/files/pix/quiz.jpg' : imgPath,
      timeout: newTimeout * 1000,
      options: []
    }

    for (let i = 0; i < newOptions.length; ++i) {
      curQuestion.options.push({
        text: newOptions[i],
        correct: newOptionsCorrect[i]
      })
    }

    fetch('/api/v1/addQuestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: quiz._id, question: curQuestion })
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      handleSetQuiz()

      res.json().then((data) => {
        console.log(data.status)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  const handleRemoveQuestion = (questionId) => {
    fetch('/api/v1/removeQuestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId: quiz._id, questionId })
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      handleSetQuiz()

      res.json().then((data) => {
        console.log(data.status)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    handleSetQuiz()
  }, [quiz])

  const answerColors = [
    'color-red',
    'color-yellow',
    'color-blue',
    'color-green'
  ]
  return (
    <Page>
      {!!quiz && (
        <>
          <div className="text-center text-white">
            <h1>{quiz.name}</h1>
          </div>
            <form className='text-white text-center'>
               <div className="image-frame">
                <label htmlFor="uploadImage" className='text-2xl cursor-pointer color-white color-white-hover text-black rounded block shadow shadow-black'>
                  <img src={imgPath} alt="Upload Image" className='text-center'/>
                </label><input onChange={handleSetImage} type="file" name="uploadImage" id="uploadImage" accept='image/*' className='hidden'/>
              </div>
            </form>
            <form onSubmit={handleAddQuestion}>
              <div className="question-form-input mt-7">
                <input
                  type="text"
                  value={newQuestionName}
                  onChange={(e) => {
                    setNewQuestionName(e.target.value)
                  }}
                  className="input-general"
                  placeholder="Question"
                />
              </div>
              <div className="question-form-input-small mt-5 flex flex-nowrap">
                <input
                  type="text"
                  value={newTimeout}
                  onChange={(e) => {
                    setNewTimeout(e.target.value)
                  }}
                  className="input-general"
                  placeholder="Duration"
                />
                <div className='text-white text-2xl p-2'>Seconds</div>
              </div>
              <div className="answer-options-container mt-5">
                {newOptions.map((option, index) => (
                  <div
                    key={`option-${index}`}
                    className={`answer-option ${answerColors[index]} mt-3 flex flex-nowrap justify-around`}
                  >
                    <div className='w-full'>
                      <input
                        type="text"
                        value={newOptions[index]}
                        onChange={(e) => {
                          const tempOptions = [...newOptions]
                          tempOptions[index] = e.target.value
                          setNewOptions(tempOptions)
                        }}
                        className="input-transparent bg-transparent text-white text-center stroke"
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                    <div>
                      <label>
                        <input type="checkbox" checked={newOptionsCorrect[index]} onChange={(e) => {
                          const tempOptionsCorrect = [...newOptionsCorrect]
                          tempOptionsCorrect[index] = !tempOptionsCorrect[index]
                          setNewOptionsCorrect(tempOptionsCorrect)
                        }} className='option-correct-checkbox'/>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-nowrap justify-center mt-5">
                <input
                  type="submit"
                  value="Add a question"
                  className="block btn btn-green create-quiz-button shadow-md shadow-gray-700"
                />
              </div>
            </form>
            {
              !!quiz.questions.length && quiz.questions.map((question, index, arr) => (
                <QuestionCard key={arr[arr.length - 1 - index]._id} _id={arr[arr.length - 1 - index]._id} name={arr[arr.length - 1 - index].question} handleRemoveQuestion={handleRemoveQuestion} />
              ))
            }
        </>
      )}
    </Page>
  )
}

export default EditQuiz
