import React                      from 'react'
import ReactDOM                   from 'react-dom'
import { Provider }               from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore }   from 'react-router-redux'

import configureStore             from './store/configureStore'
import App                        from './containers/App'
import routes                     from './routes'

import 'react-select/dist/react-select.css'
import '../css/main'
import '../vendor/fontello/fontello.css'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      { routes }
    </Router>
  </Provider>,
  document.getElementById('client_root')
)
