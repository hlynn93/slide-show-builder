import * as ActionTypes from '../constants/actionTypes'
import { LANGUAGES } from '../constants/appConstants';

export default (state = {
  lng: LANGUAGES.English
}, action) => {
  const { type, lng } = action
  switch (type) {
    case ActionTypes.SET_LANGUAGE:
      return { ...state, lng }

    default: return state
  }
}
