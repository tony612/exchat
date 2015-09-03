import { combineReducers } from 'redux'
import messages from './messages'
import channel from './channel'

const rootReducer = combineReducers({
  channel,
  messages
})

export default rootReducer
