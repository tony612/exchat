import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'

import messages from './messages'
import channels from './channels'
import session from './session'

const rootReducer = combineReducers({
  messages,
  channels,
  session,
  routing: routeReducer
})

export default rootReducer
