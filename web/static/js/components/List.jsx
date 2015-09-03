import React, { Component, PropTypes } from 'react'

export default class List extends Component {
  render() {
    const { items, renderItem } = this.props

    return (
      <div>
        {items.map(renderItem)}
      </div>
    )
  }
}

List.propTypes = {
  renderItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired
}
