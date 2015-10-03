import _ from 'lodash'

import { RECEIVED_MESSAGE } from '../constants/ActionTypes'

const initialState = {}

export default function messages(state = initialState, action) {
  switch (action.type) {
  case RECEIVED_MESSAGE:
    return {
      ...state,
      [`${action.channel}:${action.ts}`]: _.pick(action, 'text', 'channel', 'ts')
    }
    break;
  default:
    return state
  }
}
