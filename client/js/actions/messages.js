import * as types from '../constants/ActionTypes'
import { RT_EVENT } from '../constants/ApiTypes'

export function postMessage(channelId, text) {
  return {
    type: types.POST_MESSAGE,
    payload: {
      channelId: channelId
    },
    [RT_EVENT]: {
      channelId: channelId,
      // TODO: change new_message to const
      event: 'new_message',
      payload: {
        text: text
      }
    }
  }
}

export function receivedMessage(payload) {
  return {
    type: types.RECEIVED_MESSAGE,
    payload
  }
}
