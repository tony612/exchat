import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'

import messages from './messages'
import channel from './channel'
import channels from './channels'

const rootReducer = combineReducers({
  channel,
  messages,
  channels,
  router: routerStateReducer
})

export default rootReducer
