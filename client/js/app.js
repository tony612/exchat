import React                      from 'react'
import ReactDOM                   from 'react-dom'
import { Provider }               from 'react-redux'
import { Router, browserHistory } from 'react-router'

import configureStore             from './store/configureStore'
import App                        from './containers/App'
import { fetchChannelsIfNeeded }  from './actions/channels'
import routes                     from './routes'

import './../css/main'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      { routes }
    </Router>
  </Provider>,
  document.getElementById('client_root')
)
