/**
 * This reducer mereges all the new entities with the existing entities.
 * In this example, this kind of serves as a DB-like state that stores all the user and repo objects
 * which can later be accessed via the IDs
 */

import merge from 'lodash/merge'

// Updates an entity cache in response to any action with response.entities.
export default (state = { users: {}, repos: {} }, action) => {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities)
  }

  return state
}
