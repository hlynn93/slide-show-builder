import { schema } from 'normalizr';

export default new schema.Entity('item', {}, {
  idAttribute: item => item.id
})
