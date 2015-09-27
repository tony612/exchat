import { API_CALL } from '../constants/ApiTypes'
import { UNKNOWN } from '../constants/ActionTypes'
import { camelizeKeys } from 'humps';
import 'isomorphic-fetch'

function callApi(endpoint, method, data) {
  let params = {
    method:  method.toLowerCase(),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
  if (data) {
    params = {...params, data}
  }
  return fetch('/api' + endpoint, params)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }

      const camelizedJson = camelizeKeys(json)

      return Object.assign({}, camelizedJson)
    })
}

export default store => next => action => {
  const apiCall = action[API_CALL]
  if (typeof apiCall === 'undefined') {
    return next(action)
  }

  let { endpoint, method, reqData } = apiCall

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[API_CALL];
    return finalAction;
  }

  let type = action.type || UNKNOWN

  let result = next(actionWith({ type: type }));

  next({type: type + '_BEGIN'})

  return callApi(endpoint, method, reqData).then(
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
