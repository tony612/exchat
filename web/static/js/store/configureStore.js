import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import rootReducer from '../reducers'
import realtimeMiddleware from '../middleware/realtime'

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
  realtimeMiddleware
)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState)

  return store
}
