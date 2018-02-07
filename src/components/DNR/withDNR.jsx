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
    onResizeStop,
    bounds,
    object,
    ...props
  }) => (<Rnd
      default={object.attr}
      bounds={bounds}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}>
      <Component src={object.url} {...props} />
    </Rnd>)
}
