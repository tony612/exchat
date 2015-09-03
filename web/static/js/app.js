import 'babel-core/polyfill'
import React from 'react'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
import App from './containers/App'
import { receivedMessage } from './actions/messages'

const store = configureStore()

store.getState().channel.on('new_message', payload => {
  store.dispatch(receivedMessage(payload.body))
})

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  document.getElementById('client_root')
)
