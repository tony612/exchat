import React, { Component, PropTypes } from 'react'

export default class List extends Component {
  getDefaultProps() {
    return {
      isLoading: false
    }
  }

  render() {
    const { items, renderItem, isLoading } = this.props

    return (
      <ul className="list-unstyled">
        {isLoading && 'loading...'}
        {!isLoading && items.map(renderItem)}
      </ul>
    )
  }
}

List.propTypes = {
  renderItem: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool
}
