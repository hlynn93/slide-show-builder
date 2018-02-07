import { schema } from 'normalizr';
import Item from './Item';

export default new schema.Entity('slide', {}, {
  id: slide => slide.id,
  objects: [Item]
})
