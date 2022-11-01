import { useSpring, animated } from 'react-spring'
import PropTypes from 'prop-types'

function QuestionCard (props) {
  const cardAnim = useSpring({ to: { opacity: 1, transform: 'translate(0, 0)' }, from: { opacity: 0, transform: 'translate(0, -50%)' }, delay: 500 })

  return (
    <animated.div style={cardAnim} className="card">
      <div className="text-center text-white text-4xl">{props.name}</div>
      <div className="buttons flex flex-nowrap justify-end mt-5">
        <button className='block btn-slim btn-blue shadow-md shadow-gray-700 mr-3'>Edit</button>
        <button onClick={() => props.handleRemoveQuestion(props._id)} className='block btn-slim btn-red shadow-md shadow-gray-700'>Remove</button>
      </div>
    </animated.div>
  )
}
QuestionCard.propTypes = {
  _id: PropTypes.any,
  name: PropTypes.any,
  handleRemoveQuestion: PropTypes.any
}

export default QuestionCard
