import { schema } from 'normalizr';

export default new schema.Entity('forms', {}, {
  idAttribute: form => form.username.toLowerCase()
})
