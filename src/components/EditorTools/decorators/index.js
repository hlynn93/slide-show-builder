import { CompositeDecorator } from "draft-js";
import getLinkDecorator from './Link';

export const getDecorators = () => {
  const decorators = [
    getLinkDecorator()
  ];
  return new CompositeDecorator(decorators)
}
