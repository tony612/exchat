import * as types from '../constants/ActionTypes'
import { API_CALL, POST, GET, PUT, DELETE } from '../constants/ApiTypes'
import Schemas from '../store/schema'

export function fetchUsers(callback) {
  return {
    type: types.FETCH_USERS,
    [API_CALL]: {
      path: '/users',
      method: GET,
      schema: Schemas.userArray,
      successCallback: callback
    }
  }
}

export function addUser(user) {
  return {
    type: types.ADD_USER,
    payload: {user}
  }
}

export function syncPresences(data) {
  return {
    type: types.SYNC_USERS_PRESENCES,
    payload: data
  }
}
