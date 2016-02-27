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
