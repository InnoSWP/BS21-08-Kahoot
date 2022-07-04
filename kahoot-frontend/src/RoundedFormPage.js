import PropTypes from 'prop-types'

function RoundedFormPage ({ children }) {
  return (
    <div className="rounded-box-white">
      <div className="box-inner">{children}</div>
    </div>
  )
}
RoundedFormPage.propTypes = {
  children: PropTypes.any
}

export default RoundedFormPage
