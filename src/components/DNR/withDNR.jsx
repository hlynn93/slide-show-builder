/**
 * HOC to inject Drag and Resize property to the component
 */
import React from 'react';
import Rnd from 'react-rnd';
import cx from 'classnames';
import { isUndefined } from 'lodash';
import { IMAGE_TOOL_TYPE } from '../../constants/builderConstants';

/* eslint-disable */

export default (Component) => {
  return ({
    className,
    id,
    isActive,
    onKeyDown,
    onDrag,
    onDragStart,
    onDragStop,
    onResize,
    onResizeStart,
    onResizeStop,
    bounds,
    disableDragging,
    enableResizing,
    object,
    ...props
  }) => {

    const { attr } = object;

    const style = !isUndefined(attr[IMAGE_TOOL_TYPE.ROTATION]) ? {
      transform: `rotate(${attr.rotation}deg)`
    } : {};

    const baseClass = "dnr_object"
    const classes = cx(
      baseClass,
      { [`${baseClass}--active`]: isActive }
    )

    return (<Rnd
      default={attr}
      position={attr}
      bounds={bounds || 'parent'}
      onResizeStart={onResizeStart}
      onResize={onResize}
      onResizeStop={onResizeStop}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragStop={onDragStop}
      enableResizing={enableResizing}
      disableDragging={disableDragging}
      className={classes}
      >
      <Component
        onKeyDown={onKeyDown}
        style={style}
        {...object}
        {...props} />
    </Rnd>)
  }
}
