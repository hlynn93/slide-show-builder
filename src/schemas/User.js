import { schema } from 'normalizr';

export default new schema.Entity('users', {}, {
  idAttribute: user => user.login.toLowerCase()
})
