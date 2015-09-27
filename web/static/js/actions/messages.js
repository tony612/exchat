import * as types from '../constants/ActionTypes'
import { RT_EVENT } from '../constants/ApiTypes'

export function postMessage(channel, text) {
  return {
    type: types.POST_MESSAGE,
    text: text,
    [RT_EVENT]: {
      channel: channel,
      // TODO: change new_message to const
      event: 'new_message'
    }
  }
}

export function receivedMessage(text) {
  return {
    type: types.RECEIVED_MESSAGE,
    text: text
  }
}
