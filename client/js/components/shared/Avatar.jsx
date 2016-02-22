import React, { PropTypes } from 'react'
import gravatar from 'gravatar'

class Avatar extends React.Component {
  render() {
    const {email, size, borderRadius} = this.props

    let src = gravatar.url(email, {size: size || 40, d: 'retro'})
    let style = {borderRadius: borderRadius || 3}
    return (
      <img src={src} alt={email} style={style}></img>
    )
  }
}

Avatar.PropTypes = {
  email: PropTypes.string.required,
  size: PropTypes.integer,
  borderRadius: PropTypes.string
}

export default Avatar
