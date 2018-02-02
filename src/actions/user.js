/**
 *  This file contains all the GitHub related actions
 */

import { CALL_API } from '../middleware/api'
import { Schemas } from '../schemas'
import * as ActionTypes from '../constants/actionTypes'
import * as GitHubAPI from '../apis/github'

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchUser = login => ({
  [CALL_API]: {
    types: [ ActionTypes.USER_REQUEST, ActionTypes.USER_SUCCESS, ActionTypes.USER_FAILURE ],
    ...GitHubAPI.fetchUser(login),
    schema: Schemas.USER
  }
})

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export const loadUser = (login, requiredFields = []) => (dispatch, getState) => {

  // Check if a user is already cached and do nothing if true
  const user = getState().entities.users[login]
  if (user && requiredFields.every(key => user.hasOwnProperty(key))) {
    return null
  }

  return dispatch(fetchUser(login))
}

// Fetches a page of starred repos by a particular user.
// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchStarred = (login) => ({
  login,
  [CALL_API]: {
    types: [ ActionTypes.STARRED_REQUEST, ActionTypes.STARRED_SUCCESS, ActionTypes.STARRED_FAILURE ],
    ...GitHubAPI.fetchStarred(login),
    schema: Schemas.REPO_ARRAY
  }
})

// Fetches a page of starred repos by a particular user.
// Relies on Redux Thunk middleware.
export const loadStarred = (login) => (dispatch) => {
  return dispatch(fetchStarred(login))
}

// This is just to test function that describe the format of sending POST request
export const sendForm = (username, password) => (dispatch) => {
  return dispatch({
    username,
    [CALL_API]: {
      types: [ ActionTypes.SEND_FORM_REQUEST, ActionTypes.SEND_FORM_SUCCESS, ActionTypes.SEND_FORM_FAILURE ],
      ...GitHubAPI.sendForm(username, password),
      schema: Schemas.FORM
    }
  })
}
