import _ from 'lodash'

import * as types from '../constants/ActionTypes'

const initialState = {
  // "1:14203123123": message1, "2:1423231312": message2, ...
  items: {}
}

export default function messages(state = initialState, action) {
  let {payload} = action
  switch (action.type) {
  case types.RECEIVED_MESSAGE:
    return {
      ...state,
      items: {
        ...state.items,
        [`${payload.channelId}:${payload.ts}`]: _.pick(payload, 'text', 'ts', 'user')
      }
    }
    break
  case types.ADD_MESSAGES:
    var msgs = _.keyBy(action.payload.messages, (m) => `${action.channelId}:${m.ts}`)
    msgs = _.mapValues(msgs, (m) => _.pick(m, 'text', 'ts', 'user'))
    return {
      ...state,
      items: {
        ...state.items,
        ...msgs
      }
    }
  case types.FETCH_MESSAGES_SUCCESS:
    var msgs = _.mapKeys(action.response.entities.messages, (val, key)=> `${action.channelId}:${val.ts}`)
    return {
      ...state,
      items: {
        ...state.items,
        ...msgs
      }
    }
  default:
    return state
  }
}
