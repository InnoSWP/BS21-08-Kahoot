import PropTypes from 'prop-types'

function Question (props) {
  const answerColors = [
    'color-red color-red-hover',
    'color-yellow color-yellow-hover',
    'color-blue color-blue-hover',
    'color-green color-green-hover'
  ]

  if (props.question.answers) {
    answerColors[0] = props.question.options[0].correct
      ? 'color-correct'
      : 'color-incorrect'
    answerColors[1] = props.question.options[1].correct
      ? 'color-correct'
      : 'color-incorrect'
    answerColors[2] = props.question.options[2].correct
      ? 'color-correct'
      : 'color-incorrect'
    answerColors[3] = props.question.options[3].correct
      ? 'color-correct'
      : 'color-incorrect'
  }

  return (
    <>
      <div className="text-center">
        <h1 className="stroke text-white question-title">
          {props.question.question}
        </h1>
        <div className="image-frame">
          <img src={props.question.image} alt="Quiz" />
        </div>
        <div className="mt-7">
          <div className="answer-options-container">
            {props.question.options.map(({ _id, text }, index) => (
              <div
                key={`option-${_id}`}
                id={_id}
                onClick={() => props.handleSetChoice(index)}
                className={`answer-option ${answerColors[index]} ${
                  props.choice === -1 || props.choice === index
                    ? 'opacity-100'
                    : 'opacity-50'
                } stroke text-white shadow shadow-black`}
              >
                <span className="align-center">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
Question.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    question: PropTypes.any.isRequired,
    image: PropTypes.any,
    options: PropTypes.array,
    answers: PropTypes.bool.isRequired
  }).isRequired,

  choice: PropTypes.any.isRequired,
  handleSetChoice: PropTypes.any.isRequired
}
// TODO: props

export default Question
