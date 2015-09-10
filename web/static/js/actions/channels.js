import * as types from '../constants/ActionTypes'
import { API_CALL, POST } from '../constants/ApiTypes'

export function createChannel(name) {
  return {
    type: types.CREATE_CHANNEL,
    [API_CALL]: {
      endpoint: '/channels',
      method: POST,
      data: {
        channel: {
          name: name
        }
      }
    }
  }
}
