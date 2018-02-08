/**
 * HOC to inject Drag and Resize property to the component
 */
import React from 'react';
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
  }) => {
    return (<Rnd
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
}
