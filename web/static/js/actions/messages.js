import * as types from '../constants/ActionTypes'
import { RT_EVENT } from '../constants/ApiTypes'

export function postMessage(text) {
  return {
    type: types.POST_MESSAGE,
    text: text,
    [RT_EVENT]: {
      channel: 'channel:#random',
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
