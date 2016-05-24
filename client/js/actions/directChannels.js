import { browserHistory } from 'react-router'
import { decamelizeKeys } from 'humps'

import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET, PUT, DELETE } from '../constants/ApiTypes'
import Schemas from '../store/schema'
import {fetchChannels, initChannel, changeChannel} from './channels'

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

export function joinDirectChannel(userId, users) {
  return {
    type: types.JOIN_DIRECT_CHANNEL,
    [API_CALL]: {
      path: '/direct_channels/join',
      method: POST,
      data: decamelizeKeys({
        userId: userId
      }),
      successCallback: function(channel, store) {
        let channelName = users[channel.userId].username
        initChannel(channel, store.dispatch, ()=> {
          browserHistory.push(`/channels/@${channelName}`)
          store.dispatch(changeChannel(channelName))
        })
      }
    },
    payload: {
      users
    }
  }
}

export function addDirectChannel(channel, users, dispatch) {
  let channelName = users[channel.userId].username
  initChannel(channel, dispatch)
  return {
    type: types.ADD_DIRECT_CHANNEL,
    payload: {channel, users}
  }
}

export function openDirectChannel({channelId}) {
  return {
    type: types.OPEN_DIRECT_CHANNEL,
    payload: {channelId}
  }
}

export function initDirectChannelsDone() {
  return {
    type: types.INIT_DIRECT_CHANNELS_DONE
  }
}
