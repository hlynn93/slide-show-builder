import user from './user'
import error from './error'
import entities from './entities'
import utils from './utils'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  entities,
  error,
  user,
  utils
})

export default rootReducer
