/**
 * To avoid dispatching duplicated actions across asynchrnous APIs,
 * this middleware checks the action and if the action involves handling ssync API calls,
 * it dispatches the actions { API_REQUEST, API_SUCCESS, API_FAILURE } to handle the situation accordingly
 */

import { normalize } from 'normalizr'
import { camelizeKeys } from 'humps'
import { isEmpty } from 'lodash';

const API_ROOT = 'https://api.github.com/'

// Uncomment this to test POST request
// const API_ROOT = 'https://postman-echo.com/'

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, schema, meta = {}) => {

  if(!isEmpty(meta)) {

    // modify meta data here
    meta.body = JSON.stringify(meta.body)
  }

  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

  return fetch(fullUrl, meta)
    .then(response =>
      response.json().then(json => {
        // Check for HTTP request errors
        if (response.status < 200 || response.status > 226) {
          return Promise.reject(json)
        }

        // Camelization (For example; `home_url` = `homeUrl`)
        const camelizedJson = camelizeKeys(json)

        return Object.assign({},
          normalize(camelizedJson, schema),
        )
      })
    )
}

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/paularmstrong/normalizr

// GitHub's API may return results with uppercase letters while the query
// doesn't contain any. For example, "someuser" could result in "SomeUser"
// leading to a frozen UI as it wouldn't find "someuser" in the entities.
// That's why we're forcing lower cases down there.

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action) // next = dispatch
  }

  let { endpoint } = callAPI
  const { schema, types, meta } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, schema, meta).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
