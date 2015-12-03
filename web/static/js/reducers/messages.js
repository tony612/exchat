import _ from 'lodash'

import * as types from '../constants/ActionTypes'

const initialState = {}

export default function messages(state = initialState, action) {
  switch (action.type) {
  case types.RECEIVED_MESSAGE:
    return {
      ...state,
      [`${action.channel}:${action.ts}`]: _.pick(action, 'text', 'channel', 'ts')
    }
    break;
  case types.FETCH_MESSAGES_SUCCESS:
    var msgs = _.mapKeys(action.response.entities.messages, (val, key)=> `${action.channel}:${val.ts}`)
    return {
      ...state,
      ...msgs
    }
  default:
    return state
  }
}
