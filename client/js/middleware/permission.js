import { API_CALL } from '../constants/ApiTypes'
import { signOut } from '../actions/auth'

export default store => next => action => {
  next(action)

  if (action.response && action.response.status === 401) {
    store.dispatch(signOut())
  }
}
