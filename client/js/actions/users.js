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
