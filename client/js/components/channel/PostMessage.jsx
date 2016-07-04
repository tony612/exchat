import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Overlay, Popover} from 'react-bootstrap'
import getPosition from 'dom-helpers/query/position'
import Keycode from '../../constants/Keycode'

const MaxSuggestionCount = 10
const queryRegex = /(^|\s)@([\w\.]*)$/i

export default class PostMessage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      target: null,
      showSuggestions: false,
      suggestionQuery: null,
      suggestionUsers: [],
      selectedSuggestionIndex: 0
    }
  }

  handleKeyDown(e) {
    let {showSuggestions, suggestionUsers} = this.state
    if (showSuggestions && suggestionUsers.length > 0) {
      this.handleSuggestionKeyDown(e)
    } else {
      this.handleNormalKeyDown(e)
    }
  }

  handleSuggestionKeyDown(e) {
    switch (e.which) {
      case Keycode.up:
        e.preventDefault()
        this.moveSelect(-1)
        break
      case Keycode.down:
        e.preventDefault()
        this.moveSelect(1)
        break
      case Keycode.enter:
      case Keycode.tab:
        e.preventDefault()
        let chosenUser = this.state.suggestionUsers[this.state.selectedSuggestionIndex]
        let newText = this.props.message.replace(queryRegex, `$1@${chosenUser.username} `)
        this.props.onChange(newText)
        this.resetSuggestions()
        break
      default:
    }
  }

  moveSelect(step) {
    let {selectedSuggestionIndex, suggestionUsers} = this.state
    let result = (selectedSuggestionIndex + step + suggestionUsers.length) % suggestionUsers.length
    this.setState({selectedSuggestionIndex: result})
  }

  handleNormalKeyDown(e) {
    const text = e.target.value.trim()
    const {onPost} = this.props
    if (e.which === Keycode.enter) {
      onPost(text)
    }
  }

  handleChange(e) {
    const text = e.target.value
    this.props.onChange(text)
    let match = text.match(queryRegex)
    if (match) {
      this.querySuggestions(match[2], e.target)
    } else {
      this.resetSuggestions()
    }
  }

  querySuggestions(query, target) {
    let {items, ids} = this.props.users
    let users = []
    if (query.length === 0) {
      if (ids.length <= MaxSuggestionCount) {
        users = ids.map((id) => items[id])
      }
    } else {
      let filteredUsers = ids.map((id) => items[id])
      filteredUsers = _.filter(filteredUsers, (user) => user.username.match(new RegExp(`^${query}`)))
      if (filteredUsers.length <= 10) {
        users = filteredUsers
      }
    }
    if (users.length > 0) {
      this.setState({showSuggestions: true, suggestionUsers: users, target: target, suggestionQuery: query})
    } else {
      this.resetSuggestions()
    }
  }

  resetSuggestions() {
    this.setState({showSuggestions: false, suggestionUsers: []})
  }

  _getPopoverStyle() {
    let target = this.state.target
    if (target) {
      let position = getPosition(target)
      console.log(position)
      return {
        width: `${position.width - 70}px`,
        left: `${position.left + 50}px !important`,
        maxWidth: "inherit"
      }
    } else {
      return {}
    }
  }

  render() {
    return (
      <div className="message-input">
        <input type='text' className="form-control" value={this.props.message}
          onChange={::this.handleChange}
          onKeyDown={::this.handleKeyDown} />
        {this._renderSuggestion()}
      </div>
    )
  }

  _renderSuggestion() {
    let title = `Users matching "${this.state.suggestionQuery}"`
    return (
      <Overlay show={this.state.showSuggestions}
               target={()=> ReactDOM.findDOMNode(this.state.target)}
               placement="top"
               containerPadding={20}>
        <Popover title={title} id="foo" className="noarrow-popover suggestion-panel" style={this._getPopoverStyle()} positionLeft={100}>
          <ul className="list-unstyled suggestion-list">
            {this.state.suggestionUsers.map((user, index) => this._renderSuggestionUser(user, index))}
          </ul>
        </Popover>
      </Overlay>
    )
  }

  _renderSuggestionUser(user, index) {
    let className = "suggestion-item"
    if (index == this.state.selectedSuggestionIndex) {
      className = className + " -active"
    }
    return (
      <li className={className} key={index}>{user.username}</li>
    )
  }

}

PostMessage.propTypes = {
  onPost: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  message: PropTypes.string
}
