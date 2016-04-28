import * as types from '../constants/ActionTypes'

export function openNewChannelModal() {
  return {
    type: types.OPEN_NEW_CHANNEL_MODAL
  }
}

export function closeNewChannelModal() {
  return {
    type: types.CLOSE_NEW_CHANNEL_MODAL
  }
}

export function openJoinChannelModal() {
  return {
    type: types.OPEN_JOIN_CHANNEL_MODAL
  }
}

export function closeJoinChannelModal() {
  return {
    type: types.CLOSE_JOIN_CHANNEL_MODAL
  }
}

export function openJoinDirectChannelModal() {
  return {
    type: types.OPEN_JOIN_DIRECT_CHANNEL_MODAL
  }
}

export function closeJoinDirectChannelModal() {
  return {
    type: types.CLOSE_JOIN_DIRECT_CHANNEL_MODAL
  }
}
