import { schema } from 'normalizr'
import User from './User'

export default new schema.Entity('repos', {
  owner: User
}, {
  idAttribute: repo => repo.fullName.toLowerCase()
})
