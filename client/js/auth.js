import jwtDecode from 'jwt-decode'

import ExSocket from './socket/ex_socket'

const Auth = {
  login(response) {
    localStorage.setItem('authToken', response.token)
    ExSocket.connect(response.token)
  },

  logout() {
    localStorage.removeItem('authToken')
    ExSocket.disconnect()
  },

  loggedIn() {
    const token = localStorage.authToken
    if (token) {
      ExSocket.connect(token, true)
    }
    return !!token
  },

  requireAuth(nextState, replace) {
    if (!this.loggedIn()) {
      replace({nextPathname: nextState.location.pathname}, '/login')
    }
  },

  rejectAuth(nextState, replace) {
    if (this.loggedIn()) {
      replace({nextPathname: nextState.location.pathname}, '/')
    }
  },

  currentUser(key = null) {
    let decoded = jwtDecode(localStorage.authToken)
    if (key) {
      return decoded[_.snakeCase(key)]
    } else {
      return decoded
    }
  }
}

export default Auth
