import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import messages from './messages'
import channels from './channels'
import session from './session'

const rootReducer = combineReducers({
  messages,
  channels,
  session,
  routing: routerReducer
})

export default rootReducer
