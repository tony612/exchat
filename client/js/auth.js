import ExSocket from './constants/ExSocket'

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
  }
}

export default Auth
