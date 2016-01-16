import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

import messages from './messages'
import channels from './channels'

const rootReducer = combineReducers({
  messages,
  channels,
  routing: routeReducer
})

export default rootReducer
