import React                     from 'react'
import ReactDOM                  from 'react-dom'
import { Provider }              from 'react-redux'
import { Router }                from 'react-router'
import createHistory             from 'history/lib/createBrowserHistory'

import configureStore, { history }            from './store/configureStore'
import App                       from './containers/App'
import { fetchChannelsIfNeeded } from './actions/channels'
import routes                    from './routes'

import './../css/main'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      { routes }
    </Router>
  </Provider>,
  document.getElementById('client_root')
)
