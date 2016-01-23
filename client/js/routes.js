import React from 'react'
import { Route } from 'react-router'

import App from './containers/App'
import Channel from './components/Channel'
import SignIn from './components/auth/SignIn'

import Auth from './auth'

const Routes = (
  <div>
    <Route path="/" component={App} onEnter={Auth.requireAuth}>
      <Route path="channels">
        <Route path=":id" component={Channel}></Route>
      </Route>
    </Route>
    <Route path="/login" component={SignIn}></Route>
  </div>
)

export default Routes
