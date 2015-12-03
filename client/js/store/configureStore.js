import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import { reduxReactRouter } from 'redux-router'
import { createHistory } from 'history'

import rootReducer from '../reducers'
import realtimeMW from '../middleware/realtime'
import apiMW from '../middleware/api'
import routes from '../routes'

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const middlewares = applyMiddleware(
  apiMW,
  realtimeMW,
  thunkMiddleware,
  loggerMiddleware
)

const composeStore = compose(
  middlewares,
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore)

export default function configureStore(initialState) {
  const store = composeStore(rootReducer, initialState)

  return store
}
