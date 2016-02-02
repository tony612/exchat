import * as types from '../constants/ActionTypes'
import { RT_EVENT } from '../constants/ApiTypes'

export function postMessage(channelId, text) {
  return {
    type: types.POST_MESSAGE,
    text: text,
    [RT_EVENT]: {
      channelId: channelId,
      // TODO: change new_message to const
      event: 'new_message'
    }
  }
}

export function receivedMessage(payload) {
  return {
    type: types.RECEIVED_MESSAGE,
    payload
  }
}
