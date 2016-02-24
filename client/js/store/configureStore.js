import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import { browserHistory } from 'react-router'

import rootReducer from '../reducers'
import realtime from '../middleware/realtime'
import api from '../middleware/api'
import auth from '../middleware/auth'
import permission from '../middleware/permission'
import routes from '../routes'

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
})

const middlewares = applyMiddleware(
  auth,
  api,
  permission,
  realtime,
  thunkMiddleware,
  loggerMiddleware
)

const composeStore = compose(
  middlewares
)(createStore)

export default function configureStore(initialState) {
  const store = composeStore(rootReducer, initialState)

  return store
}
