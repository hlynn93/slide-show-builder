import React from 'react';
// import Draggable from 'react-draggable';
import Rnd from 'react-rnd';

/* eslint-disable */

export default (Component) => {
  return ({
    onDrag,
    onDragStart,
    onDragStop,
    onResize,
    onResizeStart,
    onResizeEnd,
    bounds,
    object,
    ...props
  }) => (<Rnd
      default={object.attr}
      bounds={bounds}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeEnd={onResizeEnd}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}>
      <Component src={object.url} {...props} />
    </Rnd>)
}
