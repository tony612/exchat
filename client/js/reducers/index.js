import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import messages from './messages'
import channels from './channels'
import session from './session'
import local from './local'

const rootReducer = combineReducers({
  messages,
  channels,
  session,
  local,
  routing: routerReducer
})

export default rootReducer
