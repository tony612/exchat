import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET, PUT, DELETE } from '../constants/ApiTypes'
import Schemas from '../store/schema'

export function fetchDirectChannels() {
  return {
    type: types.FETCH_DIRECT_CHANNELS,
    [API_CALL]: {
      path: "/direct_channels",
      method: GET,
      schema: Schemas.CHANNEL_ARRAY,
    }
  }
}
