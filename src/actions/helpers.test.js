/**
 * An example unit test case
 */

import { resetErrorMessage } from './helpers';
import { RESET_ERROR_MESSAGE } from './constants/actionTypes';

describe('actions', () => {
  it('should reset the error message', () => {
    const expectedAction = {
      type: RESET_ERROR_MESSAGE,
    }
    expect(resetErrorMessage()).toEqual(expectedAction)
  })
})
