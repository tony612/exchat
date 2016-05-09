import { decamelizeKeys } from 'humps'

import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET, PUT, DELETE } from '../constants/ApiTypes'
import Schemas from '../store/schema'
import {fetchChannels} from './channels'

export function fetchDirectChannels(users) {
  let result = fetchChannels((dispatch)=> {
    console.log('INIT DIRECT CHANNELS DONE')
    dispatch(initDirectChannelsDone())
  })
  return {
    ...result,
    type: types.FETCH_DIRECT_CHANNELS,
    payload: {
      users
    },
    [API_CALL]: {
      ...result[API_CALL],
      path: '/direct_channels'
    }
  }
}

export function joinDirectChannel(userId) {
  return {
    type: types.JOIN_DIRECT_CHANNEL,
    [API_CALL]: {
      path: '/direct_channels/join',
      method: POST,
      data: decamelizeKeys({
        userId: userId
      })
    }
  }
}

export function initDirectChannelsDone() {
  return {
    type: types.INIT_DIRECT_CHANNELS_DONE
  }
}
