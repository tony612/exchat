import * as types from '../constants/ActionTypes'

const initialState = {
  openNewChannelModal: false
}

export default function session(state = initialState, action) {
  switch (action.type) {
  case types.OPEN_NEW_CHANNEL_MODAL:
    return {
      ...state,
      openNewChannelModal: true
    }
    break
  case types.CLOSE_NEW_CHANNEL_MODAL:
  case types.CREATE_CHANNEL_SUCCESS:
    return {
      ...state,
      openNewChannelModal: false
    }
    break
  default:
    return state
  }
}
