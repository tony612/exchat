const Auth = {
  loggedIn() {
    return !!localStorage.authToken
  },

  requireAuth(nextState, replace) {
    if (!Auth.loggedIn()) {
      replace({nextPathname: nextState.location.pathname}, '/login')
    }
  },

  rejectAuth(nextState, replace) {
    if (Auth.loggedIn()) {
      replace({nextPathname: nextState.location.pathname}, '/')
    }
  }
}

export default Auth
