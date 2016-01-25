import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import { syncHistory } from 'react-router-redux'
import createHistory from 'history/lib/createBrowserHistory'

import rootReducer from '../reducers'
import realtimeMW from '../middleware/realtime'
import apiMW from '../middleware/api'
import routes from '../routes'

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
})

export const history = createHistory()
const reduxRouterMiddleware = syncHistory(history)

const middlewares = applyMiddleware(
  apiMW,
  realtimeMW,
  thunkMiddleware,
  loggerMiddleware,
  reduxRouterMiddleware
)

const composeStore = compose(
  middlewares
)(createStore)

export default function configureStore(initialState) {
  const store = composeStore(rootReducer, initialState)

  return store
}
