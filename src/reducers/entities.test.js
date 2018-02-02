import entities from './entities'
import { USER_SUCCESS } from '../actions/github'

describe('entities reducer', () => {

  const initialState = {
    users: {},
    repos: {}
  }

  it('should return the initial state', () => {
    expect(entities(undefined, {})).toEqual(initialState)
  })

  it('should handle loading the user', () => {

    const action = {
      type: USER_SUCCESS,
      response: {
        entities: {
          users: {
            hlynn93: {}
          }
        }
      }
    }

    const expectedState = {
      users: {
        hlynn93: {}
      },
      repos: {}
    }

    expect(entities(initialState, action)).toEqual(expectedState)
  })


})
