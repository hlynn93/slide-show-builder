import * as ActionTypes from '../constants/actionTypes'
// import union from 'lodash/union'

const initialState = {
  isFetching: false,
  error: '',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.STARRED_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: ''
      }
    case ActionTypes.STARRED_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      }
    case ActionTypes.STARRED_SUCCESS: {
      const { login, response } = action
      return {
        ...state,
        isFetching: false,
        error: action.error,
        [login]: {
          ...state[login],
          repos: response.result
        }
      }
    }
    default: return state
  }
}
