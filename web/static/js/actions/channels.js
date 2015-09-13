import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET } from '../constants/ApiTypes'

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

export function fetchChannels() {
  return {
    type: types.FETCH_CHANNELS,
    [API_CALL]: {
      endpoint: '/channels',
      method: GET
    }
  }
}

export function fetchChannelsIfNeeded() {
  return (dispatch, getState) => {
    return dispatch(fetchChannels())
  }
}
