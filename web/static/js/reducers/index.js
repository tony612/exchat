import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'

import messages from './messages'
import channels from './channels'

const rootReducer = combineReducers({
  messages,
  channels,
  router: routerStateReducer
})

export default rootReducer
