import React from 'react'
import { Route } from 'react-router'

import App from './containers/App'
import Channel from './components/Channel'

const Routes = (
  <Route path="/" component={App}>
    <Route path="channels">
      <Route path=":id" component={Channel} />
    </Route>
  </Route>
)

export default Routes
