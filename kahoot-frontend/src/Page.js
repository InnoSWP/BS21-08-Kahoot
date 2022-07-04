import PropTypes from 'prop-types'

function Page ({ children }) {
  return (
  <div className="wrapper">
      {children}
  </div>
  )
}
Page.propTypes = {
  children: PropTypes.any
}

export default Page
