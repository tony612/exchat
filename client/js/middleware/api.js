import { camelizeKeys, decamelizeKeys, decamelize } from 'humps'
import 'isomorphic-fetch'
import { normalize } from 'normalizr'

import { API_CALL, GET } from '../constants/ApiTypes'
import { UNKNOWN, FETCHING_FAILURE, FETCHING_SUCCESS } from '../constants/ActionTypes'

function objToParams(obj) {
  return Object.keys(obj).map(k =>
    `${encodeURIComponent(decamelize(k))}=${encodeURIComponent(obj[k])}`
  ).join('&')
}

function callApi(options) {
  let {path, method, data, schema, headers} = options
  let params = {
    method: method.toLowerCase(),
    headers: Object.assign({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }, headers)
  }
  if (data) {
    if (method !== GET) {
      params = {...params, body: JSON.stringify(decamelizeKeys(data))}
    } else {
      path = `${path}?${objToParams(data)}`
    }
  }
  return fetch('/api' + path, params)
    .then(response =>
      // FIXME: When there is an error, it may not be json
      response.json().then(json => ({json, response}))
    ).then(({json, response}) => {
      if (!response.ok) {
        return Promise.reject({error: json, response})
      }

      let normalizedJson = camelizeKeys(json)
      if (schema) {
        normalizedJson = normalize(normalizedJson, schema)
      }

      return Object.assign({}, normalizedJson)
    })
}

export default store => next => action => {
  const apiCall = action[API_CALL]
  if (typeof apiCall === 'undefined') {
    return next(action)
  }

  function actionWith(params) {
    const finalAction = Object.assign({}, action, params)
    delete finalAction[API_CALL]
    return finalAction
  }

  let type = action.type || UNKNOWN

  next(actionWith({type: type}))

  return callApi(apiCall).then(
    response => {
      next(actionWith({
        response,
        type: type + '_SUCCESS'
      }))
      if (apiCall.successCallback) {
        apiCall.successCallback(response, store)
      }
      next({
        type: FETCHING_SUCCESS,
        actualType: type
      })
    },
    response => {
      if (!response.response) {
        return console.error(response)
      }
      var {error, response} = response
      let errorMsg = error.message || 'Something bad happened'
      next(actionWith({
        type: type + '_FAILURE',
        error: errorMsg,
        response
      }))
      next({
        type: FETCHING_FAILURE,
        error: errorMsg,
        actualType: type
      })
    }
  )
}
