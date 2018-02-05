import React from 'react';
import Draggable from 'react-draggable';

/* eslint-disable */

export default (Component) => {
  return ({
    onStart,
    onDrag,
    onStop,
    grid,
    defaultPosition,
    bounds,
    ...props
  }) => (<Draggable
      defaultPosition={defaultPosition}
      grid={grid}
      bounds={bounds}
      onStart={onStart}
      onDrag={onDrag}
      onStop={onStop}>
      <Component {...props} />
    </Draggable>)
}
