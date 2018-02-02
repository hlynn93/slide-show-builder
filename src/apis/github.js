/**
 * This file contains all the GitHub related APIs and
 */

export const fetchUser = login => ({ endpoint: `users/${login}` })

export const fetchStarred = login => ({ endpoint: `users/${login}/starred`})

export const sendForm = (username, password) => ({
  endpoint: `post`,
  meta: {
    body: { username, password },
    method: 'post',
    mode: 'no-cors', // only use this if the server does not support CORS headers, otherwise, remove this line
  }
})

