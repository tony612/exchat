import { combineReducers } from 'redux'
import messages from './messages'
import channel from './channel'
import channels from './channels'

const rootReducer = combineReducers({
  channel,
  messages,
  channels
})

export default rootReducer
