const Auth = {
  loggedIn() {
    return !!localStorage.authToken
  },

  requireAuth(nextState, replace) {
    if (!Auth.loggedIn()) {
      replace({nextPathname: nextState.location.pathname}, '/login')
    }
  }
}

export default Auth
