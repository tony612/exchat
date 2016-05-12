import * as types from '../constants/ActionTypes'

const initialState = {
  openNewChannelModal: false,
  openJoinChannelModal: false
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
  case types.OPEN_JOIN_CHANNEL_MODAL:
    return {
      ...state,
      openJoinChannelModal: true
    }
    break
  case types.CLOSE_JOIN_CHANNEL_MODAL:
  case types.JOIN_CHANNEL_SUCCESS:
    return {
      ...state,
      openJoinChannelModal: false
    }
    break
  case types.OPEN_JOIN_DIRECT_CHANNEL_MODAL:
    return {
      ...state,
      openJoinDirectChannelModal: true
    }
    break
  case types.CLOSE_JOIN_DIRECT_CHANNEL_MODAL:
  case types.JOIN_DIRECT_CHANNEL_SUCCESS:
    return {
      ...state,
      openJoinDirectChannelModal: false
    }
    break
  default:
    return state
  }
}
