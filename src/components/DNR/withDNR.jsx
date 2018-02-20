/**
 * HOC to inject Drag and Resize property to the component
 */
import React from 'react';
import Rnd from 'react-rnd';
import { isUndefined } from 'lodash';
import { IMAGE_TOOL_TYPES } from '../../constants/appConstants';

/* eslint-disable */

export default (Component) => {
  return ({
    onKeyDown,
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

    const { attr } = object;

    const style = !isUndefined(attr[IMAGE_TOOL_TYPES.ROTATION]) ? {
      transform: `rotate(${attr.rotation}deg)`
    } : {};

    return (<Rnd
      default={attr}
      bounds={bounds || 'parent'}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}>
      <Component
        onKeyDown={onKeyDown}
        style={style}
        {...object}
        {...props} />
    </Rnd>)
  }
}
