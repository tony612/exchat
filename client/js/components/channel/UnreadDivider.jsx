import React, { PropTypes } from 'react'

class UnreadDivider extends React.Component {
  render() {
    return (
      <div style={style.container} className="unread-divider">
        <span style={style.text}>new messages</span>
      </div>
    )
  }
}

const style = {
  container: {
    borderBottom: '1px solid #ffb7b7',
    textAlign: 'right',
    height: '10px',
    marginBottom: '1rem',
    marginTop: '-1rem',
    cursor: 'default'
  },
  text: {
    color: '#ffb7b7',
    background: '#fff',
    float: 'right',
    paddingLeft: '10px',
    fontSize: '13px'
  }
}

export default UnreadDivider
