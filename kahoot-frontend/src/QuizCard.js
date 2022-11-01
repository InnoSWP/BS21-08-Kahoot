import { Link, useNavigate } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import PropTypes from 'prop-types'

function QuizCard (props) {
  const cardAnim = useSpring({ to: { opacity: 1, transform: 'translate(0, 0)' }, from: { opacity: 0, transform: 'translate(0, -50%)' }, delay: 500 })
  const navigate = useNavigate()

  const handleCreateQuiz = () => {
    fetch('/api/v1/createGame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: props._id })
    }).then((res) => {
      if (res.status !== 200) {
        console.log('Error: ' + res.status)
        return
      }

      res.json().then((data) => {
        console.log(data.status)
        navigate(`/runQuiz?gameId=${data.gameId}`, { replace: false })
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <animated.div style={cardAnim} className="card">
      <div className="text-center text-white"><h1>{props.name}</h1></div>
      <div className="buttons flex flex-nowrap justify-end mt-5">
        <button onClick={handleCreateQuiz} className='block btn-slim btn-green shadow-md shadow-gray-700 mr-3'>Run</button>
        <Link to={`/editQuiz?quizId=${props._id}`} className='block btn-slim btn-blue shadow-md shadow-gray-700 mr-3'>Edit</Link>
        <button onClick={() => props.handleRemoveQuiz(props._id)} className='block btn-slim btn-red shadow-md shadow-gray-700'>Remove</button>
      </div>
    </animated.div>
  )
}
QuizCard.propTypes = {
  _id: PropTypes.any,
  name: PropTypes.any,
  handleRemoveQuiz: PropTypes.any
}

export default QuizCard
