import React from 'react'
import { Route } from 'react-router'

import App from './containers/App'
import Channel from './components/channel/Channel'
import SignIn from './components/session/SignIn'

import Auth from './auth'

const Routes = (
  <div>
    <Route path="/" component={App} onEnter={::Auth.requireAuth}>
      <Route path="channels">
        <Route path="@:id" component={Channel}></Route>
        <Route path=":id" component={Channel}></Route>
      </Route>
    </Route>
    <Route path="/login" component={SignIn} onEnter={::Auth.rejectAuth}></Route>
  </div>
)

export default Routes
