import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

class ErrorMessage extends React.Component {
    render() {
      let {error} = this.props
      if (error && error.length > 0) {
        return (
          <div className="alert alert-danger" role="alert">{error}</div>
        )
      } else {
        return <div></div>
      }
    }
}

ErrorMessage.propTypes = {
  error: PropTypes.string
}

ErrorMessage.defaultProps = {
  error: null
}

export default ErrorMessage
