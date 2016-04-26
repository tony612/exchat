import * as types from '../constants/ActionTypes'

let initialState = {
  initDirectChannelsDone: false
}

export default function directChannels(state = initialState, action) {
  switch (action.type) {
    case types.INIT_DIRECT_CHANNELS_DONE:
      return {
        ...state,
        initDirectChannelsDone: true
      }
      break
    default:
      return state
  }
}
