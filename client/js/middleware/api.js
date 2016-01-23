import { camelizeKeys } from 'humps';
import 'isomorphic-fetch'
import { normalize } from 'normalizr'

import { API_CALL } from '../constants/ApiTypes'
import { UNKNOWN } from '../constants/ActionTypes'

function callApi(path, method, data, schema) {
  let params = {
    method:  method.toLowerCase(),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  if (data) {
    params = {...params, body: JSON.stringify(data)}
  }
  return fetch('/api' + path, params)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
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

  let { path, method, data, schema } = apiCall

  function actionWith(params) {
    const finalAction = Object.assign({}, action, params);
    delete finalAction[API_CALL];
    return finalAction;
  }

  let type = action.type || UNKNOWN

  let result = next(actionWith({ type: type }));

  next({type: type + '_BEGIN'})

  return callApi(path, method, data, schema).then(
    response => {
      if (apiCall.successCallback) {
        apiCall.successCallback(response, store)
      }
      next(actionWith({
        response,
        type: type + '_SUCCESS'
      }))
    },
    error => next(actionWith({
      type: type + '_FAILURE',
      error: error.message || 'Something bad happened'
    }))
  );
}
